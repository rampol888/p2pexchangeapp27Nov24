import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { validateBankDetails } from '../utils/bankValidation';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Validation middleware
const validatePaymentIntent = (req, res, next) => {
  const { amount, fromCurrency, toCurrency } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ 
      error: 'Invalid amount',
      details: 'Amount must be a positive number'
    });
  }

  if (!fromCurrency || !toCurrency) {
    return res.status(400).json({ 
      error: 'Invalid currency',
      details: 'Both fromCurrency and toCurrency are required'
    });
  }

  next();
};

// Add validation for supported currencies
const SUPPORTED_CURRENCIES = new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'HKD', 
  'NZD', 'SGD', 'SEK', 'DKK', 'NOK', 'MXN', 'PLN', 'BRL'
]);

// Add validation middleware
const validateCurrency = (req, res, next) => {
  const { fromCurrency, toCurrency } = req.body;
  
  if (!SUPPORTED_CURRENCIES.has(fromCurrency) || !SUPPORTED_CURRENCIES.has(toCurrency)) {
    return res.status(400).json({ 
      error: 'Unsupported currency',
      message: 'One or both currencies are not supported'
    });
  }
  
  next();
};

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Convert amount to cents/smallest currency unit
    const amountInSmallestUnit = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      // Optional metadata
      metadata: {
        type: 'currency_exchange',
        fromCurrency: currency,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(400).json({
      error: {
        message: error.message || 'An error occurred while creating the payment intent',
      }
    });
  }
});

router.get('/verify-payment/:paymentIntentId', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Return payment details
    res.json({
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(400).json({
      message: error.message || 'Failed to verify payment'
    });
  }
});

router.post('/bank-transfer', async (req, res) => {
  try {
    const { amount, currency, bankDetails } = req.body;

    // Validate bank details based on country
    const validationError = validateBankDetails(bankDetails);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Create payment intent for bank transfer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      payment_method_types: ['sepa_debit', 'bacs_debit', 'au_becs_debit'],
      payment_method_data: {
        type: getBankTransferType(bankDetails.country),
        billing_details: {
          name: bankDetails.name,
          email: bankDetails.email,
        },
        [getBankTransferType(bankDetails.country)]: {
          country: bankDetails.country,
          ...getBankAccountDetails(bankDetails)
        }
      },
      confirm: true,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent
    });

  } catch (error) {
    console.error('Bank transfer error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

function getBankTransferType(country) {
  const types = {
    GB: 'bacs_debit',
    EU: 'sepa_debit',
    US: 'ach_debit',
    SG: 'sg_bank_transfer'
  };
  return types[country] || 'sepa_debit';
}

function getBankAccountDetails(bankDetails) {
  switch (bankDetails.country) {
    case 'GB':
      return {
        sort_code: bankDetails.sortCode,
        account_number: bankDetails.bankAccount
      };
    case 'US':
      return {
        routing_number: bankDetails.routingNumber,
        account_number: bankDetails.bankAccount
      };
    case 'EU':
      return {
        iban: bankDetails.bankAccount
      };
    case 'SG':
      return {
        bank_code: bankDetails.bankCode,
        branch_code: bankDetails.branchCode,
        account_number: bankDetails.bankAccount
      };
    default:
      return {};
  }
}

export default router;
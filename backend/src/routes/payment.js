import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

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

export default router;
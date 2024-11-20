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

router.post('/create-payment-intent', validatePaymentIntent, validateCurrency, async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    // Convert amount to smallest currency unit (cents, yen, etc.)
    const multiplier = fromCurrency === 'JPY' ? 1 : 100;
    const amountInSmallestUnit = Math.round(parseFloat(amount) * multiplier);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: fromCurrency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        fromCurrency,
        toCurrency,
        originalAmount: amount.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/verify-payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    console.log('Verifying payment:', paymentIntentId);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    console.log('Payment intent retrieved:', paymentIntent);

    // Format the response
    const response = {
      status: paymentIntent.status,
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency,
      metadata: {
        originalAmount: paymentIntent.metadata.originalAmount,
        fromCurrency: paymentIntent.metadata.fromCurrency,
        exchangeRate: paymentIntent.metadata.exchangeRate
      }
    };

    console.log('Sending response:', response);
    
    res.json(response);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Exchange payment intent
app.post('/api/payment/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        type: 'exchange',
        ...metadata
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Wallet funding payment intent
app.post('/api/wallet/fund', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    console.log('Wallet funding request:', { amount, currency });

    if (!amount || !currency) {
      return res.status(400).json({
        error: 'Missing amount or currency'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        type: 'wallet_funding'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Wallet funding error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment verification endpoint
app.get('/api/payment/verify-payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

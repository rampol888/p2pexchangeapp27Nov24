import express from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route for creating payment intent for wallet funding
router.post('/fund', auth, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    console.log('Received request:', { amount, currency }); // Debug log

    if (!amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'currency']
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects integers
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user.id,
        type: 'wallet_funding'
      }
    });

    console.log('Payment intent created:', paymentIntent.id); // Debug log

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Wallet funding error:', error);
    res.status(500).json({ 
      error: 'Failed to process payment intent',
      details: error.message 
    });
  }
});

// Simple success webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('Payment succeeded:', paymentIntent.id);
  }

  res.json({ received: true });
});

export default router;

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Validate the amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount'
      });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount should be in cents
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router; 
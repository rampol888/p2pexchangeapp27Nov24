const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');

router.post('/payment/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, paymentMethod } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields: amount and currency'
      });
    }

    const paymentMethodTypes = paymentMethod === 'bank' 
      ? ['sepa_debit']
      : ['card'];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency: currency.toLowerCase(),
      payment_method_types: paymentMethodTypes,
      metadata: {
        type: 'exchange'
      },
      payment_method_options: {
        sepa_debit: {
          mandate_options: {
            interval: 'one_time'
          }
        }
      }
    });

    return res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router; 
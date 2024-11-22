const stripe = require('stripe');

// Function to validate Stripe key format
const validateStripeKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  return key.startsWith('sk_test_') || key.startsWith('sk_live_');
};

// Get the secret key from environment
const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

if (!validateStripeKey(secretKey)) {
  console.error('Invalid Stripe secret key format');
  throw new Error('Invalid Stripe configuration');
}

// Create Stripe instance
const stripeInstance = stripe(secretKey);

// Test the connection
stripeInstance.paymentIntents.list({ limit: 1 })
  .then(() => console.log('✓ Stripe connection verified'))
  .catch(error => {
    console.error('Stripe connection error:', error.message);
    process.exit(1);
  });

module.exports = stripeInstance;
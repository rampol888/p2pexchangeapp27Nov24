import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing Stripe Publishable Key');
  throw new Error('Missing Stripe Publishable Key');
}

export const stripeConfig = {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    options: {
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#0066cc',
        },
      },
    },
  };
  
  // Initialize Stripe
  export const stripePromise = loadStripe(stripeConfig.publishableKey);
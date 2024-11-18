import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

export function PaymentForm({ amount, fromCurrency, toCurrency, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Please provide payment details.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe not initialized or missing client secret');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="text-white mb-2">
          <span className="font-medium">Amount:</span> {amount} {fromCurrency}
        </div>
        <div className="text-gray-300 text-sm">
          Converting to {toCurrency}
        </div>
      </div>

      <PaymentElement />

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-blue-500/10 border border-blue-500 text-blue-500 rounded-lg p-3">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`
          w-full bg-blue-600 text-white py-3 rounded-lg font-medium
          hover:bg-blue-700 transition-colors
          ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

export function WalletPaymentForm({ amount, currency, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe not initialized or missing client secret');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payment-success`,
        },
      });

      if (submitError) {
        throw submitError;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess && onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      toast.error(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/5 rounded-lg p-4 mb-4">
        <div className="text-black mb-2">
          <span className="font-medium">Amount:</span> {amount} {currency}
        </div>
      </div>

      <PaymentElement 
        options={{
          style: {
            base: {
              color: '#000000',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#6B7280'
              }
            },
            invalid: {
              color: '#EF4444',
              iconColor: '#EF4444'
            }
          }
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-500 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`
          w-full bg-black text-white py-3 rounded-lg font-medium
          hover:bg-black/90 transition-colors
          ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 
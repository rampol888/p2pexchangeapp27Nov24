import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function PaymentForm({ amount, fromCurrency, toCurrency, convertedAmount, clientSecret, onSuccess, exchangeRate }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payment-success`,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setError(error.message);
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent); // Debug log
        
        // Call onSuccess before any navigation
        onSuccess(paymentIntent);

        toast.success('Payment successful!');
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
        <div className="text-gray-300 mb-2">Payment Summary:</div>
        <div className="text-white font-medium">
          Amount: {amount} {fromCurrency}
        </div>
        <div className="text-white font-medium">
          You will receive: {convertedAmount} {toCurrency}
        </div>
      </div>

      <PaymentElement />

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3">
          {error}
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
        {processing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          `Pay ${amount} ${fromCurrency}`
        )}
      </button>

      {/* Success Message */}
      {processing && (
        <div className="text-center text-gray-300 mt-4">
          Please wait while we process your payment...
        </div>
      )}
    </form>
  );
}

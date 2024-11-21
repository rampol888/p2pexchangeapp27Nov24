import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from './components/PaymentForm';
import axios from 'axios';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function Payment() {
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get amount and currency from URL params
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  useEffect(() => {
    const initializePayment = async () => {
      if (!amount || !currency) {
        setError('Missing amount or currency');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/payment/create-payment-intent', {
          amount: parseFloat(amount),
          toCurrency: currency,
          fromCurrency: 'USD'
        });

        console.log('Payment intent created:', response.data);

        if (response.data.clientSecret && response.data.paymentIntentId) {
          setClientSecret(response.data.clientSecret);
          setPaymentIntentId(response.data.paymentIntentId);
        } else {
          throw new Error('Invalid payment intent response');
        }
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err.response?.data?.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [amount, currency]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Initializing payment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#0066cc',
      }
    },
    loader: 'auto'
  };

  console.log('Rendering Payment with options:', options);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Complete Payment</h1>
        <div className="text-gray-300 mb-6">
          Amount: {parseFloat(amount).toFixed(2)} {currency.toUpperCase()}
        </div>
        
        {clientSecret && paymentIntentId ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm 
              amount={parseFloat(amount).toFixed(2)}
              currency={currency.toUpperCase()}
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        ) : (
          <div className="text-red-400">Initializing payment...</div>
        )}

        {/* Debug info */}
        <div className="mt-4 text-xs text-gray-500">
          Client Secret: {clientSecret ? 'Present' : 'Missing'}<br />
          Amount: {amount}<br />
          Currency: {currency}
        </div>
      </div>
    </div>
  );
}

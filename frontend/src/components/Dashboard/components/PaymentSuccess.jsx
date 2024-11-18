import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment_intent and payment_intent_client_secret from URL
        const params = new URLSearchParams(location.search);
        const paymentIntentId = params.get('payment_intent');

        if (!paymentIntentId) {
          throw new Error('No payment intent ID found');
        }

        // Verify payment with your backend
        const response = await fetch(`/api/payment/verify-payment/${paymentIntentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        setTransaction(data);
        
        // Start redirect timer only after verification
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 5000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, location, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">×</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          {transaction && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-white mb-3">
                Transaction Details
              </h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">
                    {transaction.amount} {transaction.currency.toUpperCase()}
                  </span>
                </div>
                {transaction.metadata && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">From:</span>
                      <span className="text-white">
                        {transaction.metadata.originalAmount} {transaction.metadata.fromCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Exchange Rate:</span>
                      <span className="text-white">
                        {transaction.metadata.exchangeRate}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 capitalize">
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-400">
            Your currency exchange has been completed successfully.
          </p>
          <p className="text-gray-400 mt-2">
            Redirecting to dashboard in 5 seconds...
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Return to Dashboard Now
          </button>
        </div>
      </div>
    </div>
  );
}

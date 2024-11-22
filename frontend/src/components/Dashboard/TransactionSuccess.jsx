import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export function TransactionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const { transactionDetails } = location.state || {};

  useEffect(() => {
    if (!transactionDetails) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        const newCount = prevCount - 1;
        if (newCount <= 0) {
          clearInterval(timer);
          navigate('/dashboard', { replace: true });
        }
        return newCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, transactionDetails]);

  if (!transactionDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Transaction Successful!
          </h2>
          <p className="text-gray-400 mb-6">
            Your payment has been processed successfully.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">
              Transaction Details
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{transactionDetails.amount} {transactionDetails.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>To Currency:</span>
                <span>{transactionDetails.toCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">
                  {transactionDetails.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="text-xs">{transactionDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>
                  {new Date(transactionDetails.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Redirecting to dashboard in {countdown} seconds...
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            Go to Dashboard Now →
          </button>
        </div>
      </div>
    </div>
  );
} 
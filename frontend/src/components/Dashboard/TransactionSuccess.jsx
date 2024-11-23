import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function TransactionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionDetails = location.state?.transactionDetails;

  useEffect(() => {
    if (!transactionDetails) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [transactionDetails, navigate]);

  if (!transactionDetails) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Transaction Successful!
        </h2>
        <p className="text-gray-300">
          Your transaction has been processed successfully.
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

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 
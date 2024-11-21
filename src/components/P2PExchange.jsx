import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('your_publishable_key');

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

export function P2PExchange() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedFromCurrency, setSelectedFromCurrency] = useState(null);
  const [selectedToCurrency, setSelectedToCurrency] = useState(null);
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExchange = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;

      // Create a payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCurrency: selectedFromCurrency.code,
          toCurrency: selectedToCurrency.code,
          amount: parseFloat(amount),
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: 'User Name', // Get this from your user context
          },
        },
      });

      if (result.error) {
        console.error(result.error);
        // Handle error
      } else {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Exchange error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              Currency Exchange
            </h1>

            {/* Currency Exchange Form */}
            <div className="space-y-6">
              {/* From Currency */}
              <div>
                <label className="block text-gray-300 mb-2">From Currency</label>
                <select
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  onChange={(e) => setSelectedFromCurrency(SUPPORTED_CURRENCIES[e.target.value])}
                >
                  <option value="">Select currency</option>
                  {SUPPORTED_CURRENCIES.map((currency, index) => (
                    <option key={currency.code} value={index}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-gray-300 mb-2">To Currency</label>
                <select
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  onChange={(e) => setSelectedToCurrency(SUPPORTED_CURRENCIES[e.target.value])}
                >
                  <option value="">Select currency</option>
                  {SUPPORTED_CURRENCIES.map((currency, index) => (
                    <option key={currency.code} value={index}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              {/* Exchange Rate Display */}
              {exchangeRate && (
                <div className="text-center text-gray-300">
                  Exchange Rate: 1 {selectedFromCurrency?.code} = {exchangeRate} {selectedToCurrency?.code}
                </div>
              )}

              {/* Exchange Button */}
              <button
                onClick={handleExchange}
                disabled={isLoading || !selectedFromCurrency || !selectedToCurrency || !amount}
                className={`
                  w-full bg-blue-600 text-white py-4 rounded-lg font-medium
                  hover:bg-blue-700 transition-colors duration-200
                  ${(isLoading || !selectedFromCurrency || !selectedToCurrency || !amount) ? 
                    'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? 'Processing...' : 'Exchange Now'}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              Exchange completed successfully!
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Multi-Currency Support
            </h3>
            <p className="text-gray-300">
              Exchange between multiple major currencies with competitive rates
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Secure Transactions
            </h3>
            <p className="text-gray-300">
              Your transactions are protected with bank-grade security
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Instant Processing
            </h3>
            <p className="text-gray-300">
              Quick and efficient currency exchange with real-time rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default P2PExchange;
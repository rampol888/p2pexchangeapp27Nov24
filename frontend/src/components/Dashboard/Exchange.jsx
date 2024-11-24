import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './components/PaymentForm';
import { BankTransferForm } from './components/BankTransferForm';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CURRENCIES } from '../../config/currencies';
import { fetchExchangeRate } from '../../utils/currencyApi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe-supported currencies
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
];

// Add minimum amounts for Stripe
const minAmounts = {
  'USD': 0.50,
  'EUR': 0.50,
  'GBP': 0.30,
  'JPY': 50,
  'AUD': 0.50,
  'CAD': 0.50,
  'CHF': 0.50,
  'HKD': 4.00,
  'NZD': 0.50,
  'SGD': 0.50,
  'SEK': 3.00,
  'DKK': 2.50,
  'NOK': 3.00,
  'MXN': 10.00,
  'PLN': 2.00,
  'BRL': 0.50
};

export function Exchange() {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exchangeDetails, setExchangeDetails] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR'
  });
  const [transactionStatus, setTransactionStatus] = useState({
    success: false,
    message: '',
    transactionId: null
  });
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const fetchAndUpdateRate = async (fromCurrency) => {
    try {
      setError(null); // Clear any existing errors
      const data = await fetchExchangeRate(fromCurrency);
      
      if (!data.conversion_rates[exchangeDetails.toCurrency]) {
        throw new Error(`Rate not found for ${exchangeDetails.toCurrency}`);
      }
      
      const rate = data.conversion_rates[exchangeDetails.toCurrency];
      setExchangeRate(rate);
      
      if (exchangeDetails.amount) {
        const converted = (parseFloat(exchangeDetails.amount) * rate).toFixed(2);
        setConvertedAmount(converted);
      }
    } catch (error) {
      console.error('Exchange error:', error);
      setError('Unable to fetch current exchange rate. Please try again later.');
      setExchangeRate(null);
      setConvertedAmount(null);
    }
  };

  const handleProceedToPayment = async () => {
    if (!exchangeDetails.amount || parseFloat(exchangeDetails.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Creating payment intent:', {
        amount: exchangeDetails.amount,
        currency: exchangeDetails.fromCurrency
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(exchangeDetails.amount) * 100),
          currency: exchangeDetails.fromCurrency.toLowerCase(),
          paymentMethod: paymentMethod // Send the selected payment method
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup payment');
      }

      console.log('Payment intent created:', {
        clientSecret: data.clientSecret ? 'Present' : 'Missing',
        paymentMethod
      });

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (err) {
      console.error('Payment setup error:', err);
      setError(err.message);
      setShowPayment(false);
      setClientSecret(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result);
    setTransactionStatus({
      success: true,
      message: `Payment of ${exchangeDetails.amount} ${exchangeDetails.fromCurrency} was successful!`,
      transactionId: result.id
    });
    
    // Optional: Reset form after successful payment
    setTimeout(() => {
      setExchangeDetails({
        amount: '',
        fromCurrency: 'USD',
        toCurrency: 'EUR'
      });
      setShowPayment(false);
      setClientSecret(null);
      setTransactionStatus({
        success: false,
        message: '',
        transactionId: null
      });
    }, 5000); // Reset after 5 seconds
  };

  // Payment form props
  const paymentProps = {
    amount: exchangeDetails.amount,
    currency: exchangeDetails.fromCurrency,
    toCurrency: exchangeDetails.toCurrency,
    onSuccess: handlePaymentSuccess
  };

  // Reset payment state when amount or currency changes
  useEffect(() => {
    setShowPayment(false);
    setClientSecret(null);
    setError(null);
  }, [exchangeDetails.amount, exchangeDetails.fromCurrency]);

  useEffect(() => {
    if (exchangeDetails.fromCurrency && exchangeDetails.toCurrency) {
      fetchAndUpdateRate(exchangeDetails.fromCurrency);
    }
  }, [exchangeDetails.fromCurrency, exchangeDetails.toCurrency]);

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setExchangeDetails(prev => ({
      ...prev,
      amount: newAmount
    }));
    
    if (exchangeRate && newAmount) {
      const converted = (parseFloat(newAmount) * exchangeRate).toFixed(2);
      setConvertedAmount(converted);
    } else {
      setConvertedAmount(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Currency Exchange</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={exchangeDetails.amount}
            onChange={handleAmountChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From Currency
            </label>
            <select
              value={exchangeDetails.fromCurrency}
              onChange={(e) => setExchangeDetails(prev => ({
                ...prev,
                fromCurrency: e.target.value
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              {Object.values(CURRENCIES).map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To Currency
            </label>
            <select
              value={exchangeDetails.toCurrency}
              onChange={(e) => setExchangeDetails(prev => ({
                ...prev,
                toCurrency: e.target.value
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              {Object.values(CURRENCIES).map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {exchangeRate && !error && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-gray-300">
                <span className="text-sm">Exchange Rate:</span>
                <span className="ml-2 font-medium">
                  1 {exchangeDetails.fromCurrency} = {exchangeRate} {exchangeDetails.toCurrency}
                </span>
              </div>
              {convertedAmount && (
                <div className="text-right">
                  <div className="text-sm text-gray-400">You'll receive approximately:</div>
                  <div className="text-lg font-semibold text-white">
                    {convertedAmount} {exchangeDetails.toCurrency}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {transactionStatus.success && (
          <div className="mb-6 bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-green-500 font-medium">{transactionStatus.message}</p>
              <p className="text-sm text-green-500/80">Transaction ID: {transactionStatus.transactionId}</p>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <div className="mt-12">
          <button
            onClick={handleProceedToPayment}
            disabled={!exchangeDetails.amount || loading}
            className={`w-full py-3 px-4 rounded-lg ${
              !exchangeDetails.amount || loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>

        {/* Payment Section */}
        {showPayment && clientSecret && (
          <div className="mt-8">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Card Payment
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  paymentMethod === 'bank'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Bank Transfer
              </button>
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#0066cc',
                  },
                },
              }}
            >
              {paymentMethod === 'card' ? (
                <PaymentForm {...paymentProps} />
              ) : (
                <BankTransferForm {...paymentProps} />
              )}
            </Elements>
          </div>
        )}

        {/* Success Message */}
        {transactionStatus.success && (
          <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Amount: {exchangeDetails.amount} {exchangeDetails.fromCurrency}</p>
              <p>To: {exchangeDetails.toCurrency}</p>
              <p>Payment Method: {paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</p>
              <p>Status: <span className="text-green-500">Completed</span></p>
              <p>Transaction ID: {transactionStatus.transactionId}</p>
              <p>Date: {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
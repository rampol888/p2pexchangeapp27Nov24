import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './components/PaymentForm';

// Replace with your actual publishable key
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
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Add validation for minimum amounts
  const validateAmount = (amount, currency) => {
    const minAmount = minAmounts[currency];
    return amount >= minAmount;
  };

  // Function to fetch exchange rate and convert amount
  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate minimum amount
    if (!validateAmount(Number(amount), fromCurrency)) {
      setError(`Minimum amount for ${fromCurrency} is ${currencies.find(c => c.code === fromCurrency)?.symbol}${minAmounts[fromCurrency]}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        const rate = data.conversion_rate;
        const converted = Number(amount) * rate;
        setExchangeRate(rate);
        setConvertedAmount(converted);
        setShowConfirmation(true);
      } else {
        throw new Error('Failed to fetch exchange rate');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to get exchange rate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to proceed to payment
  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          fromCurrency,
          toCurrency,
          convertedAmount
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment setup failed');
      }

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (err) {
      console.error('Payment setup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#374151',
      colorText: '#ffffff',
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Currency Exchange</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {!showPayment ? (
          <>
            <form onSubmit={handleConvert} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    From Currency
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option 
                        key={currency.code} 
                        value={currency.code}
                        className="bg-gray-700 text-white"
                      >
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
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option 
                        key={currency.code} 
                        value={currency.code}
                        disabled={currency.code === fromCurrency}
                        className="bg-gray-700 text-white"
                      >
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount ({currencies.find(c => c.code === fromCurrency)?.symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">
                    {currencies.find(c => c.code === fromCurrency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                    placeholder={`Min: ${minAmounts[fromCurrency]} ${fromCurrency}`}
                    required
                    min={minAmounts[fromCurrency]}
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Minimum amount: {currencies.find(c => c.code === fromCurrency)?.symbol}
                  {minAmounts[fromCurrency]} {fromCurrency}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {loading ? 'Converting...' : 'Convert'}
              </button>
            </form>

            {showConfirmation && (
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">Conversion Summary</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}</p>
                  <p className="text-lg font-semibold text-white">
                    {amount} {fromCurrency} = {convertedAmount?.toFixed(2)} {toCurrency}
                  </p>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            )}
          </>
        ) : clientSecret ? (
          <div className="mt-6">
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance
              }}
            >
              <PaymentForm 
                amount={amount} 
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                convertedAmount={convertedAmount}
                clientSecret={clientSecret}
              />
            </Elements>
          </div>
        ) : (
          <div className="text-white text-center py-4">
            Loading payment form...
          </div>
        )}
      </div>
    </div>
  );
} 
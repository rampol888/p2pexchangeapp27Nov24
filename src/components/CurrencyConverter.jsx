import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/e074617efd7dd1aaf176515e/latest/${fromCurrency}`
      );
      const data = await response.json();
      
      if (data.result === 'success') {
        const rate = data.conversion_rates[toCurrency];
        setExchangeRate(rate);
        if (amount) {
          setConvertedAmount((amount * rate).toFixed(2));
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value && exchangeRate) {
      setConvertedAmount((value * exchangeRate).toFixed(2));
    } else {
      setConvertedAmount(null);
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
          convertedAmount: parseFloat(convertedAmount)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      navigate(`/payment?client_secret=${data.clientSecret}&payment_intent=${data.paymentIntentId}`);

    } catch (err) {
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Currency Converter</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {isLoading ? (
          <div className="text-center text-gray-400">Loading exchange rate...</div>
        ) : (
          exchangeRate && amount && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="text-gray-300 mb-2">
                Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
              </div>
              <div className="text-2xl font-semibold text-white">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            </div>
          )
        )}
      </div>

      {error && (
        <div className="text-red-400 mt-4 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!convertedAmount || isLoading}
        className={`
          mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium
          hover:bg-blue-700 transition-colors duration-200
          ${(!convertedAmount || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
}

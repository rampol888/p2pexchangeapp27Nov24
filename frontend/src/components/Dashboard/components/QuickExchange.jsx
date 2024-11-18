import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function QuickExchange() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(0.85);

  const handleExchange = (e) => {
    e.preventDefault();
    // Handle exchange logic here
    console.log('Exchange:', { amount, fromCurrency, toCurrency });
  };

  const calculateExchangeAmount = () => {
    if (!amount) return '0.00';
    return (parseFloat(amount) * exchangeRate).toFixed(2);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <form onSubmit={handleExchange} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              From
            </label>
            <div className="flex space-x-2">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="text-gray-400" size={24} />
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              To
            </label>
            <div className="flex space-x-2">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
              <input
                type="text"
                value={calculateExchangeAmount()}
                readOnly
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="text-sm text-gray-400">
          Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Exchange Now
        </button>
      </form>
    </div>
  );
} 
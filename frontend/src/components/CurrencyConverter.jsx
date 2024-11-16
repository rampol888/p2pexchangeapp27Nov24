import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw } from 'lucide-react';
import { Navigation } from './Navigation';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', icon: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', icon: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', icon: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', icon: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: '🇨🇳' },
  ];

  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.42,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    CNY: 6.45,
  };

  const handleConvert = () => {
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const convertedAmount = parseFloat(amount) * rate;
    setResult(convertedAmount.toFixed(2));
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <>
      <Navigation />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Currency Converter</h2>
            <RefreshCw className="w-5 h-5 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter amount"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.icon} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center md:justify-start">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors mt-6"
                >
                  <ArrowLeftRight className="w-6 h-6 text-blue-500" />
                </button>
              </div>

              <div className="md:-mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.icon} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Convert
            </button>

            {/* Result */}
            {result && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Converted Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currencies.find(c => c.code === toCurrency)?.symbol}{result}
                    </p>
                  </div>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Live Rate</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyConverter;

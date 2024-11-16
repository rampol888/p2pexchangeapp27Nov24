import React, { useState, useEffect } from 'react';
import { X, RefreshCw, ArrowDown } from 'lucide-react';
import { fetchCurrencyRates } from '../utils/currencyApi';

const currencyIcons = {
  USD: {
    color: '#85bb65',
    symbol: '$',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#85bb65]/20 flex items-center justify-center">
        <span className="text-[#85bb65] font-bold">$</span>
      </div>
    )
  },
  EUR: {
    color: '#0052b4',
    symbol: '€',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#0052b4]/20 flex items-center justify-center">
        <span className="text-[#0052b4] font-bold">€</span>
      </div>
    )
  },
  GBP: {
    color: '#003087',
    symbol: '£',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#003087]/20 flex items-center justify-center">
        <span className="text-[#003087] font-bold">£</span>
      </div>
    )
  },
  SGD: {
    color: '#ef3340',
    symbol: 'S$',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#ef3340]/20 flex items-center justify-center">
        <span className="text-[#ef3340] font-bold">S$</span>
      </div>
    )
  },
  JPY: {
    color: '#bc002d',
    symbol: '¥',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#bc002d]/20 flex items-center justify-center">
        <span className="text-[#bc002d] font-bold">¥</span>
      </div>
    )
  },
  CAD: {
    color: '#ff0000',
    symbol: 'C$',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#ff0000]/20 flex items-center justify-center">
        <span className="text-[#ff0000] font-bold">C$</span>
      </div>
    )
  }
};

const CurrencyOption = ({ currency }) => (
  <div className="flex items-center space-x-2">
    {currencyIcons[currency.code].icon}
    <span>{currency.code}</span>
  </div>
);

export const ExchangeModal = ({ isOpen, onClose }) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  ];

  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      const newRates = await fetchCurrencyRates(fromCurrency);
      if (newRates) {
        setRates(newRates);
      }
      setLoading(false);
    };

    getRates();
    const interval = setInterval(getRates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fromCurrency]);

  const calculateExchangeAmount = () => {
    if (!rates || !amount) return '';
    const rate = rates[toCurrency];
    return (parseFloat(amount) * rate).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Currency Exchange</h3>
            <p className="text-sm text-gray-500">Get real-time exchange rates</p>
          </div>

          {/* From Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              From
            </label>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {currencyIcons[fromCurrency].icon}
                </div>
              </div>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pl-10"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Arrow Indicator with Animation */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors cursor-pointer"
                 onClick={() => {
                   setFromCurrency(toCurrency);
                   setToCurrency(fromCurrency);
                 }}>
              <ArrowDown className="h-6 w-6 text-gray-500" />
            </div>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              To
            </label>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={calculateExchangeAmount()}
                  readOnly
                  className="w-full pl-12 pr-4 py-2 rounded-lg border-gray-300 bg-gray-50"
                  placeholder={loading ? "Loading..." : "0.00"}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {currencyIcons[toCurrency].icon}
                </div>
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pl-10"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Rate Display */}
          {rates && (
            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <span>Exchange Rate:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {currencyIcons[fromCurrency].icon}
                  <span>1 {fromCurrency} = </span>
                  {currencyIcons[toCurrency].icon}
                  <span>{rates[toCurrency]?.toFixed(4)} {toCurrency}</span>
                </div>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          {/* Exchange Button */}
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium
              hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
              transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loading || !amount}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              'Exchange Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

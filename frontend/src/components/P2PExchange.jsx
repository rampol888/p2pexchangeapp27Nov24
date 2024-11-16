import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, Globe, Shield, Clock, DollarSign } from 'lucide-react';
import { Navigation } from './Navigation';
import { fetchCurrencyRates } from '../utils/currencyApi';

const P2PExchange = () => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  ];

  // Fetch exchange rates
  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      try {
        const newRates = await fetchCurrencyRates(fromCurrency);
        if (newRates) {
          setRates(newRates);
          setError(null);
        } else {
          setError('Unable to fetch exchange rates');
        }
      } catch (err) {
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };

    getRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(getRates, 300000);
    return () => clearInterval(interval);
  }, [fromCurrency]);

  // Calculate converted amount
  const calculateConvertedAmount = () => {
    if (!rates || !amount) return '';
    const rate = rates[toCurrency];
    if (!rate) return '';
    return (parseFloat(amount) * rate).toFixed(2);
  };

  // Handle currency change
  const handleFromCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    setFromCurrency(newCurrency);
    // Rates will be updated by the useEffect
  };

  const handleSendMoney = () => {
    navigate('/signup');
  };

  const benefits = [
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Global Coverage",
      description: "Send money to over 200 countries worldwide"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Secure Transfers",
      description: "Bank-level security for all your transactions"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Fast Delivery",
      description: "Most transfers arrive within minutes"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-500" />,
      title: "Great Rates",
      description: "Competitive exchange rates with low fees"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Currency Converter */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Send Money Internationally
              </h1>
              <p className="text-xl text-gray-600">
                Fast, secure, and affordable money transfers worldwide
              </p>
            </div>

            {/* Currency Converter Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                {/* From Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    You Send
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 block w-full rounded-lg border-gray-300 shadow-sm 
                        focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                    <select
                      value={fromCurrency}
                      onChange={handleFromCurrencyChange}
                      className="rounded-lg border-gray-300 shadow-sm 
                        focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* To Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    They Receive
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      value={calculateConvertedAmount()}
                      disabled
                      className="flex-1 block w-full rounded-lg border-gray-300 bg-gray-50"
                      placeholder={loading ? "Loading..." : "Converted amount"}
                    />
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="rounded-lg border-gray-300 shadow-sm 
                        focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Exchange Rate Display */}
                {rates && (
                  <div className="text-sm text-gray-600">
                    1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMoney}
                disabled={loading || !amount}
                className={`w-full py-3 px-4 ${
                  loading || !amount 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-lg font-medium flex items-center 
                justify-center space-x-2 transition-colors duration-200`}
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Loading...' : 'Send Money Now'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Why Choose Our Service?
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>No hidden fees or charges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Regulated and licensed service</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Real-time transfer tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PExchange;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { toast } from 'react-hot-toast';

export function HomePage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Supported currencies
  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'HKD', 
    'NZD', 'SGD', 'SEK', 'DKK', 'NOK'
  ];

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/e074617efd7dd1aaf176515e/latest/${fromCurrency}`
      );
      const data = await response.json();
      
      if (data.result === 'success') {
        setExchangeRate(data.conversion_rates[toCurrency]);
      } else {
        toast.error('Failed to fetch exchange rate');
      }
    } catch (error) {
      toast.error('Error fetching exchange rate');
    } finally {
      setLoading(false);
    }
  };

  // Calculate converted amount with 0.2% fee
  const calculateConversion = () => {
    if (!amount || !exchangeRate) return;
    
    const baseConversion = amount * exchangeRate;
    const fee = baseConversion * 0.002; // 0.2% fee
    const totalAmount = baseConversion + fee;
    
    setConvertedAmount({
      baseAmount: baseConversion.toFixed(2),
      fee: fee.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  // Fetch rate when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  // Calculate when amount or rate changes
  useEffect(() => {
    calculateConversion();
  }, [amount, exchangeRate]);

  // Add this section after the Hero Section and before Features Section
  const converterSection = (
    <div className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Glowing effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="bg-gray-800/40 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Currency Converter
            </h2>
            <p className="text-gray-400">Get real-time exchange rates with competitive fees</p>
          </div>
          
          <div className="space-y-8">
            {/* Amount Input with Currency Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">You Send</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 hover:bg-gray-700/70"
                    placeholder="Enter amount"
                    min="0"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-white px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-gray-500 transition-colors"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">You Receive</label>
                <div className="relative">
                  <input
                    type="text"
                    value={convertedAmount ? convertedAmount.baseAmount : ''}
                    readOnly
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl outline-none"
                    placeholder="0.00"
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-white px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-gray-500 transition-colors"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Exchange Rate Display */}
            {exchangeRate && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <span>Exchange Rate:</span>
                <span className="font-medium text-white">
                  1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
                </span>
              </div>
            )}

            {/* Conversion Details */}
            {convertedAmount && (
              <div className="bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-700/50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Converted Amount</span>
                  <span className="text-white font-medium">
                    {convertedAmount.baseAmount} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Fee (0.2%)</span>
                  <span className="text-white font-medium">
                    {convertedAmount.fee} {toCurrency}
                  </span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Total Amount</span>
                  <span className="text-white font-bold">
                    {convertedAmount.totalAmount} {toCurrency}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-medium 
                hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] 
                focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg"
            >
              Start Converting Now
            </button>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-400">
              <p>No hidden fees • Secure transactions • 24/7 support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add these CSS animations to your global styles or component
  const styles = `
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  // Add this style tag to your document head or CSS file
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Connecting payments, Empowering exchange
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Exchange currencies securely and instantly with our peer-to-peer platform.
            Get the best rates and manage multiple currencies in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium 
                hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-medium 
                hover:bg-gray-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Currency Converter Section */}
      {converterSection}

      {/* Features Section */}
      <div className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Multi-Currency Support */}
            <div className="bg-gray-700/50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Multi-Currency Support
              </h3>
              <p className="text-gray-300">
                Exchange between multiple major currencies with competitive rates.
                Support for USD, EUR, GBP, and more.
              </p>
            </div>

            {/* Secure Transactions */}
            <div className="bg-gray-700/50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Secure Transactions
              </h3>
              <p className="text-gray-300">
                Bank-grade security with advanced encryption and secure payment processing.
                Your funds are always safe.
              </p>
            </div>

            {/* Instant Processing */}
            <div className="bg-gray-700/50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Instant Processing
              </h3>
              <p className="text-gray-300">
                Quick and efficient currency exchange with real-time rates.
                No waiting for days to complete transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sign Up</h3>
              <p className="text-gray-300">Create your account in minutes</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">KYC Verification</h3>
              <p className="text-gray-300">Quick and easy verification process</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Add Funds</h3>
              <p className="text-gray-300">Load your wallet with your preferred currency</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Trading</h3>
              <p className="text-gray-300">Exchange currencies at great rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
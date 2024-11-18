import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            P2P Currency Exchange Platform
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
import React from 'react';
import { CreditCard, Globe, Shield, Wallet } from 'lucide-react';

export function Card() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">International Card</h1>
          <p className="text-xl text-gray-600">Your borderless payment solution - Coming Soon!</p>
        </div>

        {/* Card Preview */}
        <div className="mb-16">
          <div className="relative w-96 h-56 mx-auto transform hover:scale-105 transition-transform duration-300">
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm mix-blend-overlay">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white text-sm">P2P Exchange</p>
                  <div className="mt-1">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Card details remain white for visibility */}
              <div>
                <div className="space-y-1">
                  <p className="text-white text-sm">Card Number</p>
                  <p className="text-white text-xl tracking-wider font-mono">•••• •••• •••• ••••</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-white text-xs">VALID THRU</p>
                    <p className="text-white">••/••</p>
                  </div>
                  <div>
                    <p className="text-white text-xs">CVV</p>
                    <p className="text-white">•••</p>
                  </div>
                  <div>
                    <p className="text-white text-xs">NAME</p>
                    <p className="text-white">CARD HOLDER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 transform hover:scale-105 transition-all duration-300 shadow-sm border border-gray-200">
            <Globe className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Acceptance</h3>
            <p className="text-gray-600">Use your card anywhere in the world with zero foreign transaction fees</p>
          </div>

          <div className="bg-white rounded-xl p-6 transform hover:scale-105 transition-all duration-300 shadow-sm border border-gray-200">
            <Shield className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">Advanced security features with real-time fraud protection</p>
          </div>

          <div className="bg-white rounded-xl p-6 transform hover:scale-105 transition-all duration-300 shadow-sm border border-gray-200">
            <Wallet className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Top-up</h3>
            <p className="text-gray-600">Load your card instantly from your P2P Exchange wallet</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
          <div className="max-w-lg mx-auto">
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're working hard to bring you 
              the most advanced international payment card. 
              Be among the first to experience borderless transactions.
            </p>
          </div>
          <button 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg 
              text-white font-semibold transform hover:scale-105 
              transition-all duration-300 shadow-sm"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}

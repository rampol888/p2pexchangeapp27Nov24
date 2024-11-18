import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const EXCHANGE_RATE_API_KEY = 'e074617efd7dd1aaf176515e';
const BASE_CURRENCY = 'USD';

// Add more currencies to track
const CURRENCIES_TO_TRACK = [
  'EUR',  // Euro
  'GBP',  // British Pound
  'JPY',  // Japanese Yen
  'AUD',  // Australian Dollar
  'CAD',  // Canadian Dollar
  'CHF',  // Swiss Franc
  'CNY',  // Chinese Yuan
  'HKD',  // Hong Kong Dollar
  'NZD',  // New Zealand Dollar
  'SGD',  // Singapore Dollar
  'INR',  // Indian Rupee
  'AED',  // UAE Dirham
  'SAR',  // Saudi Riyal
  'KRW',  // South Korean Won
];

const ExchangeRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        setRates(data.conversion_rates);
        setLastUpdated(new Date().toLocaleString());
        setError(null);
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg">
            <div className="h-6 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CURRENCIES_TO_TRACK.map((currency) => {
          const rate = rates[currency];
          const isUp = Math.random() > 0.5; // Simulate rate change direction

          return (
            <div
              key={currency}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">
                  {BASE_CURRENCY}/{currency}
                </span>
                <span className={`flex items-center text-xs ${
                  isUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="ml-1">Live</span>
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {rate ? rate.toFixed(4) : 'N/A'}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  1 {BASE_CURRENCY} = {rate} {currency}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {lastUpdated && (
        <div className="text-sm text-gray-400 text-right">
          Last updated: {lastUpdated}
        </div>
      )}
    </div>
  );
};

export const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          Live Exchange Rates
        </h2>
        <span className="text-sm text-gray-400">
          Base Currency: {BASE_CURRENCY}
        </span>
      </div>
      <ExchangeRates />
      {/* ... rest of your dashboard content ... */}
    </div>
  );
}; 
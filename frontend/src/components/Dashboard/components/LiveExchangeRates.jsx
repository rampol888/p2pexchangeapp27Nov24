import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function LiveExchangeRates() {
  const [rates, setRates] = useState([
    {
      pair: 'BTC/USD',
      rate: '45,123.45',
      change: '+2.5%',
      isPositive: true
    },
    {
      pair: 'ETH/USD',
      rate: '3,234.56',
      change: '-1.2%',
      isPositive: false
    },
    {
      pair: 'EUR/USD',
      rate: '1.1845',
      change: '+0.3%',
      isPositive: true
    },
    {
      pair: 'GBP/USD',
      rate: '1.3756',
      change: '+0.5%',
      isPositive: true
    }
  ]);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Live Exchange Rates</h2>
      <div className="space-y-4">
        {rates.map((rate, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-300">{rate.pair}</span>
            <div className="flex items-center">
              <span className="text-white font-medium mr-2">{rate.rate}</span>
              <span className={`flex items-center ${
                rate.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {rate.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {rate.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
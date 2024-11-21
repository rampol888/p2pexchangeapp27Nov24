import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function StatsCard({ title, value, change, isPositive }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-white">{value}</p>
        <span className={`ml-2 flex items-center text-sm ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {change}
        </span>
      </div>
    </div>
  );
} 
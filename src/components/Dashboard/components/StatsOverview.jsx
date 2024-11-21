import React from 'react';
import { StatsCard } from './StatsCard';

export function StatsOverview() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Total Transactions',
      value: '156',
      change: '+23.1%',
      isPositive: true
    },
    {
      title: 'Active Orders',
      value: '12',
      change: '-5.2%',
      isPositive: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
} 
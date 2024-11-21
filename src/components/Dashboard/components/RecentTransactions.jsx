import React from 'react';

export function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      type: 'Exchange',
      from: { currency: 'USD', amount: 1000 },
      to: { currency: 'EUR', amount: 920 },
      date: '2024-02-10',
      status: 'Completed'
    },
    // Add more mock transactions as needed
  ];

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div 
          key={tx.id}
          className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
        >
          <div>
            <span className="px-2 py-1 rounded text-sm bg-green-500/10 text-green-400">
              {tx.status}
            </span>
            <p className="text-white mt-1">
              {tx.from.amount} {tx.from.currency} → {tx.to.amount} {tx.to.currency}
            </p>
          </div>
          <div className="text-gray-400 text-sm">{tx.date}</div>
        </div>
      ))}
    </div>
  );
} 
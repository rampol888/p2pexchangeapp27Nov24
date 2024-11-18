import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function TransactionTable() {
  const transactions = [
    {
      id: 1,
      type: 'Buy',
      asset: 'BTC',
      amount: '0.25',
      price: '$45,123.45',
      total: '$11,280.86',
      status: 'Completed',
      date: '2024-02-10 14:30',
    },
    {
      id: 2,
      type: 'Sell',
      asset: 'ETH',
      amount: '2.5',
      price: '$2,345.67',
      total: '$5,864.18',
      status: 'Pending',
      date: '2024-02-10 13:15',
    },
    {
      id: 3,
      type: 'Buy',
      asset: 'ETH',
      amount: '1.5',
      price: '$2,345.67',
      total: '$3,518.51',
      status: 'Completed',
      date: '2024-02-10 13:15',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {tx.type === 'Buy' ? (
                        <ArrowUp className="h-4 w-4 mx-2 text-green-400" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mx-2 text-red-400" />
                      )}
                      <span className="text-white">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-white">{tx.asset}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{tx.amount}</td>
                  <td className="px-6 py-4 text-white">{tx.price}</td>
                  <td className="px-6 py-4 text-white">{tx.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'Completed' 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{tx.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
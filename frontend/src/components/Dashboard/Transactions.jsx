import React from 'react';

export function Transactions() {
  const transactions = [
    {
      id: 1,
      date: '2024-03-20',
      type: 'Exchange',
      amount: '500',
      currency: 'USD',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-03-19',
      type: 'Exchange',
      amount: '300',
      currency: 'EUR',
      status: 'Pending'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
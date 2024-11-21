import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export function Sidebar({ onLogout }) {
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: null,
    },
    {
      path: '/dashboard/exchange',
      name: 'Exchange',
      icon: null,
    },
    {
      path: '/dashboard/wallet',
      name: 'Wallet',
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      path: '/dashboard/transactions',
      name: 'Transactions',
      icon: null,
    },
  ];

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-lg p-6">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Exchange</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link to={item.path} className="text-gray-300 hover:text-white block py-2">
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <button
          onClick={onLogout}
          className="mt-auto text-gray-300 hover:text-white py-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 
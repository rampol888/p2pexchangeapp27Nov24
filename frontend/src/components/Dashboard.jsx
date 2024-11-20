import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function Dashboard() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Exchange', href: '/dashboard/exchange' },
    { name: 'Wallet', href: '/dashboard/wallet' },
    { name: 'Transactions', href: '/dashboard/transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        {/* Main content */}
        <div className="flex-1 flex">
          {/* Side Navigation */}
          <div className="bg-gray-800 w-64 p-6 space-y-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'}
                    `}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

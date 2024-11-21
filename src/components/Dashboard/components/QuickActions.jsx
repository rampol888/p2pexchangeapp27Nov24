import React from 'react';

export function QuickActions() {
  const actions = [
    { icon: '💱', label: 'Exchange' },
    { icon: '📊', label: 'Rates' },
    { icon: '📜', label: 'History' },
    { icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-gray-800/50 backdrop-blur-lg rounded-xl hover:bg-gray-700/50 transition-colors"
        >
          <span className="text-2xl mb-2">{action.icon}</span>
          <span className="text-sm text-gray-300">{action.label}</span>
        </button>
      ))}
    </div>
  );
} 
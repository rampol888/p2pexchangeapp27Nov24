import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="stats-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && (
          <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
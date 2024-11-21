import React, { useEffect, useState } from 'react';

const GlobeCurrencyBackground = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Currency data with geographical positions
  const currencies = [
    { 
      symbol: '$', 
      name: 'USD', 
      color: 'text-emerald-400',
      position: { left: '25%', top: '35%' }, // North America
      region: 'North America'
    },
    { 
      symbol: '€', 
      name: 'EUR', 
      color: 'text-blue-400',
      position: { left: '48%', top: '30%' }, // Europe
      region: 'Europe'
    },
    { 
      symbol: '£', 
      name: 'GBP', 
      color: 'text-purple-400',
      position: { left: '45%', top: '25%' }, // UK
      region: 'United Kingdom'
    },
    { 
      symbol: '¥', 
      name: 'JPY', 
      color: 'text-red-400',
      position: { left: '80%', top: '35%' }, // Japan
      region: 'Japan'
    },
    { 
      symbol: '₹', 
      name: 'INR', 
      color: 'text-orange-400',
      position: { left: '65%', top: '45%' }, // India
      region: 'India'
    },
    { 
      symbol: '₿', 
      name: 'BTC', 
      color: 'text-yellow-400',
      position: { left: '50%', top: '50%' }, // Center
      region: 'Global'
    },
    { 
      symbol: 'A$', 
      name: 'AUD', 
      color: 'text-teal-400',
      position: { left: '85%', top: '75%' }, // Australia
      region: 'Australia'
    },
    { 
      symbol: '元', 
      name: 'CNY', 
      color: 'text-red-500',
      position: { left: '75%', top: '40%' }, // China
      region: 'China'
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 animate-gradient-shift">
        {/* Animated overlay for extra depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
        
        {/* Glowing orbs in background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* World Map Container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* World Map Image */}
          <div className="relative w-full h-full">
            <img 
              src="/world-map-blue.jpeg" 
              alt="World Map"
              className="absolute w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
            
            {/* Dynamic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 animate-shimmer"></div>

            {/* Currency Markers */}
            {currencies.map((currency, index) => (
              <div
                key={currency.name}
                className="absolute animate-float"
                style={{
                  ...currency.position,
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {/* Enhanced Currency Card */}
                <div className={`
                  ${currency.color} bg-white/10 backdrop-blur-md 
                  px-4 py-2 rounded-xl border border-white/20 
                  shadow-[0_0_15px_rgba(255,255,255,0.1)] 
                  transform hover:scale-110 hover:bg-white/20 
                  transition-all duration-300 ease-out
                  flex items-center space-x-3 group
                `}>
                  <span className="text-2xl font-bold">{currency.symbol}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{currency.name}</span>
                    <span className="text-xs opacity-75">{currency.region}</span>
                  </div>
                  
                  {/* Enhanced connecting lines */}
                  <div className="absolute -inset-4 border-2 border-current opacity-0 
                    group-hover:opacity-30 rounded-full transition-all duration-300
                    group-hover:scale-110"></div>
                </div>

                {/* Enhanced glowing dot */}
                <div className={`absolute -inset-2 ${currency.color} opacity-50 rounded-full blur-xl group-hover:opacity-75 transition-opacity duration-300`}></div>
              </div>
            ))}

            {/* Enhanced connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {currencies.map((currency, i) => (
                currencies.slice(i + 1).map((target, j) => (
                  <line
                    key={`${currency.name}-${target.name}`}
                    x1={`${parseInt(currency.position.left)}%`}
                    y1={`${parseInt(currency.position.top)}%`}
                    x2={`${parseInt(target.position.left)}%`}
                    y2={`${parseInt(target.position.top)}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                    style={{ animationDelay: `${(i + j) * 0.2}s` }}
                  />
                ))
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.5)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlobeCurrencyBackground;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  CreditCard, 
  Send, 
  Bell, 
  Settings, 
  Search,
  TrendingUp,
  DollarSign,
  RefreshCw,
  X
} from 'lucide-react';
import { fetchCurrencyRates } from '../utils/currencyApi';
import { ExchangeModal } from './ExchangeModal';
import { motion } from 'framer-motion';

export function Dashboard() {
  const currencies = [
    { 
      code: 'USD', 
      name: 'US Dollar',
      symbol: '$'
    },
    { 
      code: 'EUR', 
      name: 'Euro',
      symbol: '€'
    },
    { 
      code: 'GBP', 
      name: 'British Pound',
      symbol: '£'
    },
    { 
      code: 'SGD', 
      name: 'Singapore Dollar',
      symbol: 'S$'
    },
    { 
      code: 'JPY', 
      name: 'Japanese Yen',
      symbol: '¥'
    },
    { 
      code: 'CAD', 
      name: 'Canadian Dollar',
      symbol: 'C$'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [rates, setRates] = useState(null);
  const [previousRates, setPreviousRates] = useState(null);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const newRates = await fetchCurrencyRates('USD');
      if (newRates) {
        if (rates) {
          setPreviousRates(rates);
        }
        setRates(newRates);
      }
    };

    fetchRates();
    // Fetch rates every 5 minutes
    const interval = setInterval(fetchRates, 300000);

    return () => clearInterval(interval);
  }, []);

  const calculateChange = (currency) => {
    if (!rates || !previousRates) return '+0.00%';
    const currentRate = rates[currency];
    const previousRate = previousRates[currency];
    if (!currentRate || !previousRate) return '+0.00%';
    
    const change = ((currentRate - previousRate) / previousRate) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const formatCurrencyValue = (currency) => {
    if (!rates) return `${currency.symbol} 0.00`;
    const rate = rates[currency.code];
    return `${currency.symbol} ${rate ? rate.toFixed(2) : '0.00'}`;
  };

  // Quick actions for money transfer
  const quickActions = [
    {
      title: "Send Money",
      icon: (
        <motion.div
          whileHover={{ scale: 1.2, rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Send 
            className="h-8 w-8 mb-4"
            style={{ stroke: 'url(#sendGradient)' }}
          />
        </motion.div>
      ),
      description: "Transfer funds instantly",
      color: "from-navy-800/50 to-navy-700/50",
      onClick: () => navigate('/send-money')
    },
    {
      title: "Exchange",
      icon: (
        <motion.div
          whileHover={{ scale: 1.2 }}
          animate={{ rotate: 360 }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { type: "spring", stiffness: 300 }
          }}
        >
          <RefreshCw 
            className="h-8 w-8 mb-4"
            style={{ stroke: 'url(#exchangeGradient)' }}
          />
        </motion.div>
      ),
      description: "Convert currencies",
      color: "from-navy-800/50 to-navy-700/50",
      onClick: () => setShowExchangeModal(true)
    },
    {
      title: "Add Money",
      icon: (
        <motion.div
          whileHover={{ 
            scale: 1.2,
            y: [-2, 2, -2],
            transition: { y: { repeat: Infinity, duration: 0.5 }}
          }}
        >
          <DollarSign 
            className="h-8 w-8 mb-4"
            style={{ stroke: 'url(#moneyGradient)' }}
          />
        </motion.div>
      ),
      description: "Top up your wallet",
      color: "from-navy-800/50 to-navy-700/50",
      onClick: () => navigate('/add-money')
    }
  ];

  // Add this function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(!!query);
    
    if (!query.trim()) {
      setFilteredCurrencies(currencies);
      return;
    }

    const filtered = currencies.filter(currency => 
      currency.name.toLowerCase().includes(query.toLowerCase()) ||
      currency.code.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCurrencies(filtered);
  };

  // Add search results dropdown component
  const SearchResults = () => {
    if (!isSearching) return null;

    return (
      <div className="absolute mt-2 w-full bg-gray-800/95 backdrop-blur-xl rounded-lg border 
        border-white/10 shadow-lg z-50 max-h-96 overflow-y-auto">
        {filteredCurrencies.length > 0 ? (
          filteredCurrencies.map((currency) => (
            <div
              key={currency.code}
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
                // Add any additional action you want when a currency is selected
              }}
              className="p-4 hover:bg-white/10 cursor-pointer transition-colors border-b 
                border-white/10 last:border-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{currency.name}</h4>
                  <p className="text-sm text-gray-400">{currency.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {formatCurrencyValue(currency)}
                  </p>
                  <p className={`text-sm ${
                    calculateChange(currency.code).startsWith('+') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {calculateChange(currency.code)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            No currencies found matching "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  // Add function to fetch all currencies
  const fetchAllCurrencies = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCurrencyRates('USD');
      if (response) {
        const currencyList = Object.entries(response).map(([code, rate]) => ({
          code,
          name: getCurrencyName(code), // You'll need to implement this helper function
          symbol: getCurrencySymbol(code), // You'll need to implement this helper function
          rate
        }));
        setAllCurrencies(currencyList);
      }
    } catch (error) {
      console.error('Failed to fetch all currencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for currency info
  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <svg className="hidden">
        <defs>
          <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
            <stop offset="100%" style={{ stopColor: '#4A5568' }} />
          </linearGradient>
          <linearGradient id="exchangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
            <stop offset="100%" style={{ stopColor: '#4A5568' }} />
          </linearGradient>
          <linearGradient id="moneyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
            <stop offset="100%" style={{ stopColor: '#4A5568' }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">P2P Exchange</h1>
            </div>

            {/* Updated Search Bar */}
            <div className="flex-1 max-w-md mx-4 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                    bg-white text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search currencies..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearching(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearching(false);
                      setFilteredCurrencies(currencies);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 
                      hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <SearchResults />
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Side Navigation */}
        <div className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/wallet"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </Link>
            <Link
              to="/card"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              <span>Card</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, User! 👋</h2>
            <p className="text-gray-600">Here's what's happening with your account today.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <motion.button 
                key={index}
                onClick={action.onClick}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {action.icon}
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {action.title}
                </motion.h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Currency List */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Live Currency Rates</h3>
              <button 
                onClick={() => {
                  setShowAllCurrencies(!showAllCurrencies);
                  if (!showAllCurrencies && allCurrencies.length === 0) {
                    fetchAllCurrencies();
                  }
                }}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>{showAllCurrencies ? 'Show Less' : 'View All'}</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
                showAllCurrencies ? 'max-h-[70vh] overflow-y-auto pr-2' : ''
              }`}>
                {(showAllCurrencies ? allCurrencies : currencies).map((currency) => {
                  const change = calculateChange(currency.code);
                  const isPositive = change.startsWith('+');
                  
                  return (
                    <motion.div
                      key={currency.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 
                        transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{currency.code}</h4>
                          <p className="text-sm text-gray-600">{currency.name}</p>
                        </div>
                        <span className={`text-sm ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {change}
                        </span>
                      </div>
                      <p className={`text-xl font-bold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrencyValue(currency)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ExchangeModal 
        isOpen={showExchangeModal} 
        onClose={() => setShowExchangeModal(false)} 
      />
    </div>
  );
}

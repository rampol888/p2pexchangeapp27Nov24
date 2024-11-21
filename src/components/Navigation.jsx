import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import pexioaceLogo from '@/assets/Pexioace Logo File editable with tagline.png';
import { ChevronDown } from 'lucide-react';

export function Navigation() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsServicesOpen(false);
  }, [location]);

  const services = [
    {
      title: 'Prepaid Card',
      description: 'Secure and convenient prepaid card solutions',
      icon: '💳',
      path: '/card'
    },
    {
      title: 'Exchange Currency',
      description: 'Competitive rates for currency exchange',
      icon: '💱',
      path: '/dashboard'
    },
    {
      title: 'Wallet',
      description: 'Digital wallet for all your transactions',
      icon: '👝',
      path: '/signup'
    },
    {
      title: 'Payments',
      description: 'Fast and secure payment solutions',
      icon: '💸',
      path: '/'
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={pexioaceLogo} 
              alt="Pexioace" 
              className="h-6 md:h-8 lg:h-9 object-contain"
            />
          </Link>

          {/* Navigation Links - Updated text sizes */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            
            {/* Services Dropdown - Updated text size */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium inline-flex items-center"
              >
                Services
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50">
                  {services.map((service, index) => (
                    <Link
                      key={service.title}
                      to={service.path}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{service.icon}</span>
                        <div>
                          <div className="text-gray-900 font-medium">
                            {service.title}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {service.description}
                          </div>
                        </div>
                      </div>
                      {index < services.length - 1 && (
                        <div className="mt-2 border-b border-gray-100"></div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Contact Us
            </Link>
            
            <Link
              to="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

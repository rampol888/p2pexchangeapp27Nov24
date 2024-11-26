import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import pexioaceLogo from "../assets/go-pexi-logo-with-tagline.png";
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants for the dropdown
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animation variants for service items
  const serviceItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2b5f] to-[#0095c3] opacity-95 backdrop-blur-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Centered Tagline */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center space-y-2 -mt-3"
          >
            <Link to="/" className="flex-shrink-0">
              <img 
                src={pexioaceLogo} 
                alt="Pexioace" 
                className="h-6 md:h-8 lg:h-9 object-contain"
              />
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs text-white/80 font-light tracking-wider text-center translate-y-2"
            >
              Digital Pulse
            </motion.div>
          </motion.div>

          {/* Navigation Links with Increased Text Size */}
          <div className="flex items-center space-x-6"> {/* Increased space between items */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-base font-semibold transition-colors" // Increased size and weight
              >
                Home
              </Link>
            </motion.div>
            
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-base font-semibold inline-flex items-center transition-colors" // Increased size and weight
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Services
                <motion.div
                  animate={{ rotate: isServicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="ml-2 h-5 w-5" /> {/* Increased icon size */}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg py-2 z-50"
                  >
                    {services.map((service, index) => (
                      <motion.div
                        key={service.title}
                        custom={index}
                        variants={serviceItemVariants}
                        whileHover="hover"
                      >
                        <Link
                          to={service.path}
                          className="block px-4 py-3 transition-colors"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <div className="flex items-start">
                            <motion.span 
                              className="text-2xl mr-3"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {service.icon}
                            </motion.span>
                            <div>
                              <div className="text-gray-900 font-medium">
                                {service.title}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {service.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link
                to="/contact"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-base font-semibold transition-colors" // Increased size and weight
              >
                Contact Us
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-base font-semibold transition-colors" // Increased size and weight
              >
                Login
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/signup"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md text-base font-semibold transition-colors border border-white/20" // Increased padding and size
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-lg py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Pexioace
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

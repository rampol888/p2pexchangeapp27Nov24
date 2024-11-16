import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to register the user
      // For now, we'll simulate a successful signup
      const response = await simulateSignup(formData);
      
      if (response.success) {
        // Store user data in localStorage or state management
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        // Redirect to KYC form
        navigate('/kyc');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Simulate API call
  const simulateSignup = async (data) => {
    // In reality, this would be your actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'dummy-token',
          user: {
            id: '123',
            username: data.username,
            email: data.email
          }
        });
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Create an Account</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  className="appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 
                    text-white bg-white/5 leading-tight focus:outline-none focus:border-blue-500 
                    focus:ring-1 focus:ring-blue-500 transition-colors"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 
                    text-white bg-white/5 leading-tight focus:outline-none focus:border-blue-500 
                    focus:ring-1 focus:ring-blue-500 transition-colors"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 
                    text-white bg-white/5 leading-tight focus:outline-none focus:border-blue-500 
                    focus:ring-1 focus:ring-blue-500 transition-colors"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 
                    text-white bg-white/5 leading-tight focus:outline-none focus:border-blue-500 
                    focus:ring-1 focus:ring-blue-500 transition-colors"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                    rounded-lg focus:outline-none focus:shadow-outline transition-colors
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
                <a 
                  className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-300 transition-colors" 
                  href="/login"
                >
                  Already have an account?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
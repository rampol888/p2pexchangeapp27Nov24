import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function KYCForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    idType: 'passport',
    idNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Store KYC data
      localStorage.setItem('kycStatus', 'completed');
      localStorage.setItem('kycData', JSON.stringify(formData));
      
      // Redirect to dashboard after KYC submission
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit KYC. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Identity Verification
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              ID Type
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="passport">Passport</option>
              <option value="driverLicense">Driver's License</option>
              <option value="nationalId">National ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              ID Number
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full bg-blue-600 text-white py-3 rounded-lg font-medium
              hover:bg-blue-700 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>
      </div>
    </div>
  );
}

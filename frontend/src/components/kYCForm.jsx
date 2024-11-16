import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Check, AlertCircle } from 'lucide-react';

const KYCForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    
    // Contact Information
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    
    // Identity Verification
    idType: '',
    idNumber: '',
    idFront: null,
    idBack: null,
    selfie: null,
    
    // Additional Information
    occupation: '',
    sourceOfFunds: '',
    purposeOfAccount: '',
  });

  const [uploadProgress, setUploadProgress] = useState({
    idFront: 0,
    idBack: 0,
    selfie: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (field, file) => {
    // Simulate file upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev[field] >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [field]: prev[field] + 10 };
      });
    }, 200);

    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const steps = [
    {
      title: "Personal Information",
      icon: "👤"
    },
    {
      title: "Contact Details",
      icon: ""
    },
    {
      title: "Identity Verification",
      icon: "🪪"
    },
    {
      title: "Additional Information",
      icon: "📋"
    }
  ];

  const handleSubmit = async () => {
    if (step !== 4) {
      setStep(prev => Math.min(4, prev + 1));
      return;
    }

    try {
      setIsSubmitting(true);
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'idFront' || key === 'idBack' || key === 'selfie') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Simulate API call (replace with your actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store KYC status in localStorage
      localStorage.setItem('kycStatus', 'completed');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('KYC submission failed:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-700"
        >
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                      ${step > i ? 'bg-blue-600 text-white' : 
                        step === i + 1 ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500' : 
                        'bg-gray-700/50 text-gray-400'} 
                      transition-all duration-300`}
                  >
                    {s.icon || i + 1}
                  </div>
                  <span className={`mt-2 text-sm ${step === i + 1 ? 'text-blue-400' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-24 mt-6 
                      ${step > i ? 'bg-blue-600' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Input fields with enhanced styling */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="block w-full rounded-lg bg-gray-700/50 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500
                        hover:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Similar styling for other inputs */}
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-8">
                  Contact Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="block w-full rounded-lg bg-gray-700/50 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500
                        hover:border-blue-400 transition-all duration-300 px-4 py-2.5"
                    />
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="block w-full rounded-lg bg-gray-700/50 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500
                        hover:border-blue-400 transition-all duration-300 px-4 py-2.5"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="group md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street"
                      className="block w-full rounded-lg bg-gray-700/50 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500
                        hover:border-blue-400 transition-all duration-300 px-4 py-2.5"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* File Upload Section with Enhanced UI */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400">
                    Front of ID Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="id-front" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                          <span>Upload a file</span>
                          <input
                            id="id-front"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('idFront', e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {uploadProgress.idFront > 0 && uploadProgress.idFront < 100 && (
                    <div className="mt-2">
                      <div className="bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${uploadProgress.idFront}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400">
                    Back of ID Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="id-back" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                          <span>Upload a file</span>
                          <input
                            id="id-back"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('idBack', e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {uploadProgress.idBack > 0 && uploadProgress.idBack < 100 && (
                    <div className="mt-2">
                      <div className="bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${uploadProgress.idBack}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400">
                    Selfie with ID Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="selfie" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                          <span>Take a photo</span>
                          <input
                            id="selfie"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            capture="user"
                            onChange={(e) => handleFileUpload('selfie', e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or upload</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Hold your ID next to your face
                      </p>
                    </div>
                  </div>
                  {uploadProgress.selfie > 0 && uploadProgress.selfie < 100 && (
                    <div className="mt-2">
                      <div className="bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${uploadProgress.selfie}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
                
                <div className="space-y-6">
                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your current occupation"
                    />
                  </div>

                  {/* Source of Funds */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Source of Funds
                    </label>
                    <select
                      value={formData.sourceOfFunds}
                      onChange={(e) => setFormData({ ...formData, sourceOfFunds: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Source</option>
                      <option value="salary">Salary</option>
                      <option value="business">Business Income</option>
                      <option value="investments">Investments</option>
                      <option value="inheritance">Inheritance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Purpose of Account */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Purpose of Account
                    </label>
                    <select
                      value={formData.purposeOfAccount}
                      onChange={(e) => setFormData({ ...formData, purposeOfAccount: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 
                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Purpose</option>
                      <option value="trading">Trading</option>
                      <option value="investment">Investment</option>
                      <option value="payments">Payments</option>
                      <option value="savings">Savings</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-white/5"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-300">
                          I agree to the Terms and Conditions
                        </label>
                        <p className="text-gray-400">
                          By checking this box, you agree to our Terms of Service and Privacy Policy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm 
                  font-medium text-gray-300 hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Previous
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
                  font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : step === 4 ? (
                  'Submit KYC'
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KYCForm;

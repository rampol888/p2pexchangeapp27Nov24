import { useState } from 'react';
import { BeneficiaryService } from '../../../services/BeneficiaryService';
import { BANK_REQUIREMENTS } from '../../../types/beneficiary';

export function BeneficiaryForm({ currency, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    currency,
    bankDetails: {},
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });

  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = BeneficiaryService.validateBeneficiary(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const savedBeneficiary = BeneficiaryService.saveBeneficiary(formData);
    onSave(savedBeneficiary);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const renderBankFields = () => {
    const requiredFields = BANK_REQUIREMENTS[currency] || [];
    
    return requiredFields.map(field => (
      <div key={field} className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
        </label>
        <input
          type="text"
          value={formData.bankDetails[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          required
        />
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500 rounded p-3">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Beneficiary Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          required
        />
      </div>

      {renderBankFields()}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bank Name
        </label>
        <input
          type="text"
          value={formData.bankDetails.bankName || ''}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Address</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address Line 1
          </label>
          <input
            type="text"
            value={formData.address.line1}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            value={formData.address.postal_code}
            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <input
            type="text"
            value={formData.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">
          Cancel
        </button>
      </div>
    </form>
  );
} 
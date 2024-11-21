import React, { useState } from 'react';

const SellOrderForm = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState({ price: '', amount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      amount: parseFloat(formData.amount),
      id: Date.now().toString(),
    });
    setFormData({ price: '', amount: '' });
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} space-y-6`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
            step="0.01"
            min="0"
            required
            className="input-field"
            placeholder="Enter price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
            step="0.000001"
            min="0"
            required
            className="input-field"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <button
        type="submit"
        className="button-primary w-full"
      >
        Place Sell Order
      </button>
    </form>
  );
};

export default SellOrderForm;
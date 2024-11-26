import React, { useState } from 'react';

export function BeneficiaryForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        bankName: '',
        accountNumber: '',
        swiftCode: '',
        country: '',
        city: '',
        address: '',
        relationship: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/beneficiaries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add beneficiary');
            }

            onSuccess?.(data);
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                bankName: '',
                accountNumber: '',
                swiftCode: '',
                country: '',
                city: '',
                address: '',
                relationship: ''
            });
        } catch (err) {
            console.error('Beneficiary save error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-200 tracking-wide">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-200 tracking-wide">Bank Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">SWIFT Code</label>
                    <input
                        type="text"
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-200 tracking-wide">Address Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Relationship</label>
                    <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-500 bg-red-500/10 border border-red-500 rounded-lg p-4">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg ${
                    isLoading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
            >
                {isLoading ? 'Saving...' : 'Save Beneficiary'}
            </button>
        </form>
    );
} 
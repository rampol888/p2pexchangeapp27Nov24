import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import { BeneficiaryService } from '../../../services/BeneficiaryService';
import { BeneficiaryForm } from './BeneficiaryForm';

const BANK_FORMATS = {
  EUR: {
    testAccount: {
      iban: 'DE89370400440532013000',
      bankName: 'Deutsche Bank'
    }
  },
  GBP: {
    testAccount: {
      sortCode: '108800',
      accountNumber: '00012345',
      bankName: 'Test Bank UK'
    }
  },
  USD: {
    testAccount: {
      routingNumber: '110000000',
      accountNumber: '000123456789',
      accountType: 'checking',
      bankName: 'Test Bank USA'
    }
  },
  SGD: {
    testAccount: {
      bankCode: '7171',
      branchCode: '001',
      accountNumber: '000123456789',
      bankName: 'Test Bank Singapore'
    }
  },
  AUD: {
    testAccount: {
      bsb: '000-000',
      accountNumber: '000123456',
      bankName: 'Test Bank Australia'
    }
  },
  JPY: {
    testAccount: {
      bankCode: '0001',
      branchCode: '001',
      accountNumber: '000123456789',
      bankName: 'Test Bank Japan'
    }
  }
};

const IBAN_STYLE = {
  base: {
    color: '#fff',
    fontSize: '16px',
    '::placeholder': { color: '#aab7c4' }
  }
};

const TestAccountInfo = ({ currency }) => {
  const testAccount = BANK_FORMATS[currency]?.testAccount;
  
  if (!testAccount || process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Test Account Details:</h4>
      <div className="space-y-2 text-xs text-gray-400">
        {Object.entries(testAccount).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        ⓘ These are test account numbers and will only work in test mode
      </div>
    </div>
  );
};

export function BankTransferForm({ amount, currency, toCurrency, onSuccess }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    name: '',
    email: '',
    accountNumber: '',
    sortCode: '',
    routingNumber: '',
    bankCode: '',
    branchCode: '',
    bsb: '',
    accountType: 'checking',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);

  useEffect(() => {
    if (selectedBeneficiary) {
      setBankDetails(prev => ({
        ...prev,
        ...selectedBeneficiary.bankDetails,
        name: selectedBeneficiary.name,
        address: selectedBeneficiary.address
      }));
    }
  }, [selectedBeneficiary]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let paymentMethod;
      const billingDetails = {
        name: bankDetails.name,
        email: bankDetails.email,
        address: {
          line1: bankDetails.address.line1,
          city: bankDetails.address.city,
          state: bankDetails.address.state,
          postal_code: bankDetails.address.postal_code,
          country: bankDetails.address.country
        }
      };

      switch(currency) {
        case 'EUR':
          const { error: sepaError, paymentMethod: sepaPayment } = await stripe.createPaymentMethod({
            type: 'sepa_debit',
            sepa_debit: elements.getElement(IbanElement),
            billing_details: billingDetails,
          });
          if (sepaError) throw new Error(sepaError.message);
          paymentMethod = sepaPayment;
          break;

        case 'GBP':
          const { error: gbpError, paymentMethod: gbpPayment } = await stripe.createPaymentMethod({
            type: 'bacs_debit',
            bacs_debit: {
              sort_code: bankDetails.sortCode.replace(/-/g, ''),
              account_number: bankDetails.accountNumber,
            },
            billing_details: billingDetails,
          });
          if (gbpError) throw new Error(gbpError.message);
          paymentMethod = gbpPayment;
          break;

        case 'USD':
          const { error: usdError, paymentMethod: usdPayment } = await stripe.createPaymentMethod({
            type: 'us_bank_account',
            us_bank_account: {
              routing_number: bankDetails.routingNumber,
              account_number: bankDetails.accountNumber,
              account_type: bankDetails.accountType,
              account_holder_type: 'individual',
            },
            billing_details: billingDetails,
          });
          if (usdError) throw new Error(usdError.message);
          paymentMethod = usdPayment;
          break;

        case 'SGD':
          const { error: sgdError, paymentMethod: sgdPayment } = await stripe.createPaymentMethod({
            type: 'us_bank_account',
            us_bank_account: {
              routing_number: bankDetails.bankCode + bankDetails.branchCode,
              account_number: bankDetails.accountNumber,
              account_holder_type: 'individual',
            },
            billing_details: billingDetails,
          });
          if (sgdError) throw new Error(sgdError.message);
          paymentMethod = sgdPayment;
          break;

        case 'AUD':
          const { error: audError, paymentMethod: audPayment } = await stripe.createPaymentMethod({
            type: 'au_becs_debit',
            au_becs_debit: {
              bsb_number: bankDetails.bsb.replace(/-/g, ''),
              account_number: bankDetails.accountNumber,
            },
            billing_details: billingDetails,
          });
          if (audError) throw new Error(audError.message);
          paymentMethod = audPayment;
          break;

        case 'JPY':
          const { error: jpyError, paymentMethod: jpyPayment } = await stripe.createPaymentMethod({
            type: 'us_bank_account',
            us_bank_account: {
              routing_number: bankDetails.bankCode + bankDetails.branchCode,
              account_number: bankDetails.accountNumber,
              account_holder_type: 'individual',
            },
            billing_details: billingDetails,
          });
          if (jpyError) throw new Error(jpyError.message);
          paymentMethod = jpyPayment;
          break;

        default:
          throw new Error('Unsupported currency');
      }

      console.log('Payment method created:', paymentMethod);
      
      navigate('/transaction-success', {
        state: {
          transactionDetails: {
            amount,
            currency,
            toCurrency,
            paymentMethod: paymentMethod.type,
            transactionId: paymentMethod.id,
            timestamp: new Date().toISOString()
          }
        },
        replace: true
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBankFields = () => {
    switch(currency) {
      case 'EUR':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                IBAN (International Bank Account Number)
              </label>
              <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3">
                <IbanElement 
                  options={{
                    supportedCountries: ['SEPA'],
                    style: IBAN_STYLE
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Example: DE89 3704 0044 0532 0130 00
              </p>
            </div>
          </div>
        );

      case 'GBP':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sort Code
              </label>
              <input
                type="text"
                value={bankDetails.sortCode}
                onChange={(e) => setBankDetails(prev => ({ ...prev, sortCode: e.target.value }))}
                placeholder="20-00-00"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{2}-\d{2}-\d{2}"
                required
              />
              <p className="mt-1 text-xs text-gray-400">Format: XX-XX-XX</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="12345678"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{8}"
                required
              />
              <p className="mt-1 text-xs text-gray-400">8 digits</p>
            </div>
          </div>
        );

      case 'USD':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Routing Number (ABA)
              </label>
              <input
                type="text"
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, routingNumber: e.target.value }))}
                placeholder="111000000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{9}"
                required
              />
              <p className="mt-1 text-xs text-gray-400">9 digits</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="000123456789"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Type
              </label>
              <select
                value={bankDetails.accountType}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountType: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        );

      case 'SGD':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bank Code
              </label>
              <input
                type="text"
                value={bankDetails.bankCode}
                onChange={(e) => setBankDetails(prev => ({ ...prev, bankCode: e.target.value }))}
                placeholder="7171"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{4}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Branch Code
              </label>
              <input
                type="text"
                value={bankDetails.branchCode}
                onChange={(e) => setBankDetails(prev => ({ ...prev, branchCode: e.target.value }))}
                placeholder="001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{3}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="1234567890"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        );

      case 'AUD':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                BSB Number
              </label>
              <input
                type="text"
                value={bankDetails.bsb}
                onChange={(e) => setBankDetails(prev => ({ ...prev, bsb: e.target.value }))}
                placeholder="123-456"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{3}-\d{3}"
                required
              />
              <p className="mt-1 text-xs text-gray-400">Format: XXX-XXX</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="12345678"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        );

      case 'JPY':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bank Code (金融機関コード)
              </label>
              <input
                type="text"
                value={bankDetails.bankCode}
                onChange={(e) => setBankDetails(prev => ({ ...prev, bankCode: e.target.value }))}
                placeholder="0001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{4}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Branch Code (支店コード)
              </label>
              <input
                type="text"
                value={bankDetails.branchCode}
                onChange={(e) => setBankDetails(prev => ({ ...prev, branchCode: e.target.value }))}
                placeholder="001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{3}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number (口座番号)
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="1234567"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                pattern="\d{7}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Type (口座種別)
              </label>
              <select
                value={bankDetails.accountType}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountType: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              >
                <option value="ordinary">Ordinary (普通)</option>
                <option value="checking">Checking (当座)</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showAddBeneficiary) {
    return (
      <BeneficiaryForm
        currency={currency}
        onSave={(beneficiary) => {
          setSelectedBeneficiary(beneficiary);
          setShowAddBeneficiary(false);
        }}
        onCancel={() => setShowAddBeneficiary(false)}
      />
    );
  }

  const beneficiaries = BeneficiaryService.getBeneficiariesByCurrency(currency);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {beneficiaries.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Beneficiary
          </label>
          <select
            value={selectedBeneficiary?.id || ''}
            onChange={(e) => {
              const beneficiary = BeneficiaryService.getBeneficiaryById(e.target.value);
              setSelectedBeneficiary(beneficiary);
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Select a beneficiary</option>
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} - {b.bankDetails.bankName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowAddBeneficiary(true)}
        className="mb-6 text-blue-400 hover:text-blue-300"
      >
        + Add New Beneficiary
      </button>

      <div className="space-y-4">
        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            value={bankDetails.name}
            onChange={(e) => setBankDetails(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            placeholder="Full Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={bankDetails.email}
            onChange={(e) => setBankDetails(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            placeholder="email@example.com"
            required
          />
        </div>

        {/* Add Address Fields */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-200 tracking-wide">
            Billing Address
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={bankDetails.address.line1}
              onChange={(e) => setBankDetails(prev => ({
                ...prev,
                address: { ...prev.address, line1: e.target.value }
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={bankDetails.address.city}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="City"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={bankDetails.address.state}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={bankDetails.address.postal_code}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, postal_code: e.target.value }
                }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="12345"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <select
                value={bankDetails.address.country}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="SG">Singapore</option>
                <option value="JP">Japan</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Currency-specific bank fields */}
        {renderBankFields()}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 rounded-lg ${
          loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
      </button>

      {/* Add test account information */}
      <TestAccountInfo currency={currency} />
    </form>
  );
}

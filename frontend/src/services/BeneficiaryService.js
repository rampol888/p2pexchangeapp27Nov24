import { BANK_REQUIREMENTS } from '../types/beneficiary';

const STORAGE_KEY = 'temp_beneficiaries';

export class BeneficiaryService {
  static getBeneficiaries() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveBeneficiary(beneficiary) {
    const beneficiaries = this.getBeneficiaries();
    const newBeneficiary = {
      ...beneficiary,
      id: crypto.randomUUID()
    };
    beneficiaries.push(newBeneficiary);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beneficiaries));
    return newBeneficiary;
  }

  static getBeneficiaryById(id) {
    return this.getBeneficiaries().find(b => b.id === id);
  }

  static getBeneficiariesByCurrency(currency) {
    return this.getBeneficiaries().filter(b => b.currency === currency);
  }

  static deleteBeneficiary(id) {
    const beneficiaries = this.getBeneficiaries().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beneficiaries));
  }

  static validateBeneficiary(beneficiary) {
    const requiredFields = BANK_REQUIREMENTS[beneficiary.currency];
    if (!requiredFields) return ['Unsupported currency'];

    const errors = [];
    requiredFields.forEach(field => {
      if (!beneficiary.bankDetails[field]) {
        errors.push(`Missing ${field}`);
      }
    });

    return errors;
  }
} 
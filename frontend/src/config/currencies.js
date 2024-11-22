export const CURRENCIES = {
    USD: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      countries: ['US'],
      bankFormat: 'ach'
    },
    EUR: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'IE', 'FI', 'PT', 'AT'],
      bankFormat: 'sepa'
    },
    GBP: {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      countries: ['GB'],
      bankFormat: 'sort_code'
    },
    SGD: {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$',
      countries: ['SG'],
      bankFormat: 'sg_bank'
    },
    AUD: {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      countries: ['AU'],
      bankFormat: 'au_bsb'
    },
    JPY: {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      countries: ['JP'],
      bankFormat: 'jp_bank'
    }
  };
  
  export const getBankFormat = (currency) => {
    return CURRENCIES[currency]?.bankFormat || 'standard';
  };
  
  export const getCountries = (currency) => {
    return CURRENCIES[currency]?.countries || [];
  };
export const TEST_BANK_ACCOUNTS = {
    USD: {
      // US ACH Bank Account
      routingNumber: '110000000',
      accountNumber: '000123456789',
      accountHolderType: 'individual',
      testIBAN: 'US45154596874512459687',
      bankName: 'TEST BANK USA',
      testDetails: {
        accountHolderName: 'Test User',
        routingNumber: '110000000',
        accountNumber: '000123456789',
        accountType: 'checking',
        accountHolderType: 'individual'
      }
    },
    EUR: {
      // SEPA Bank Accounts
      DE: {
        iban: 'DE89370400440532013000',
        bankName: 'Deutsche Bank'
      },
      FR: {
        iban: 'FR1420041010050500013M02606',
        bankName: 'BNP Paribas'
      },
      ES: {
        iban: 'ES9121000418450200051332',
        bankName: 'Santander'
      }
    },
    GBP: {
      // UK Bank Account
      sortCode: '20-00-00',
      accountNumber: '55779911',
      bankName: 'Barclays Test'
    },
    SGD: {
      // Singapore Bank Account
      bankCode: '7171',
      branchCode: '001',
      accountNumber: '0001234567',
      bankName: 'DBS Bank'
    },
    AUD: {
      // Australian Bank Account
      bsb: '000-000',
      accountNumber: '123456789',
      bankName: 'Commonwealth Bank'
    },
    JPY: {
      // Japanese Bank Account
      bankCode: '0001',
      branchCode: '001',
      accountNumber: '1234567',
      bankName: 'MUFG Bank'
    }
  };

  
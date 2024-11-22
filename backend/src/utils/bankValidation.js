export function validateBankDetails(details) {
  const { country, bankAccount } = details;

  switch (country) {
    case 'GB':
      if (!isValidUKAccount(details)) {
        return 'Invalid UK bank account details';
      }
      break;
    case 'EU':
      if (!isValidIBAN(bankAccount)) {
        return 'Invalid IBAN';
      }
      break;
    case 'US':
      if (!isValidUSAccount(details)) {
        return 'Invalid US bank account details';
      }
      break;
    case 'SG':
      if (!isValidSGAccount(details)) {
        return 'Invalid Singapore bank account details';
      }
      break;
    default:
      return 'Unsupported country';
  }

  return null;
}

function isValidIBAN(iban) {
  // Add IBAN validation logic
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
  return ibanRegex.test(iban);
}

function isValidUKAccount(details) {
  const sortCodeRegex = /^[0-9]{6}$/;
  const accountNumberRegex = /^[0-9]{8}$/;
  return sortCodeRegex.test(details.sortCode) && accountNumberRegex.test(details.bankAccount);
}

function isValidUSAccount(details) {
  const routingNumberRegex = /^[0-9]{9}$/;
  const accountNumberRegex = /^[0-9]{4,17}$/;
  return routingNumberRegex.test(details.routingNumber) && accountNumberRegex.test(details.bankAccount);
}

function isValidSGAccount(details) {
  const bankCodeRegex = /^[0-9]{4}$/;
  const branchCodeRegex = /^[0-9]{3}$/;
  const accountNumberRegex = /^[0-9]{10,12}$/;
  return (
    bankCodeRegex.test(details.bankCode) &&
    branchCodeRegex.test(details.branchCode) &&
    accountNumberRegex.test(details.bankAccount)
  );
} 
const API_KEY = 'e074617efd7dd1aaf176515e';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const fetchCurrencyRates = async (base = 'USD') => {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return null;
  }
};

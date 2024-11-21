export const EXCHANGE_RATE_API_KEY = 'e074617efd7dd1aaf176515e';
export const EXCHANGE_RATE_API_BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const fetchExchangeRate = async (fromCurrency) => {
  const response = await fetch(
    `${EXCHANGE_RATE_API_BASE_URL}/${EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`
  );
  return response.json();
};

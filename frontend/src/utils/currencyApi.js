export const fetchExchangeRate = async (fromCurrency) => {
  if (!fromCurrency) {
    throw new Error('Currency code is required');
  }

  try {
    const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || 'e074617efd7dd1aaf176515e';
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'API returned an error');
    }
    
    return data;
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    throw error;
  }
};

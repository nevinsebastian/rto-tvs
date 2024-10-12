// api.js
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCustomerCounts = async (token) => {
  const response = await fetch(`${BASE_URL}/sales/customers/count`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Similarly, use this in other API calls

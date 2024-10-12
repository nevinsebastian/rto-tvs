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
  
  if (!response.ok) {
    throw new Error('Failed to fetch customer counts');
  }

  return await response.json();
};

export const fetchReviewCounts = async (token) => {
  const response = await fetch(`${BASE_URL}/sales/customer-verification/count`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch review counts');
  }

  const data = await response.json();
  return {
    reviews_pending: data['reviews pending'],
    reviews_done: data['reviews Done'],
  };
};


// Similarly, use this in other API calls

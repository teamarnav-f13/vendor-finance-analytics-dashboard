import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'https://0wek2322jl.execute-api.ap-south-1.amazonaws.com/prod';

async function getAuthToken() {
  const session = await fetchAuthSession();

  // ✅ USE ACCESS TOKEN (not ID token)
  return session.tokens.accessToken.toString();
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      // ✅ TEMPLATE STRING (BACKTICKS)
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const vendorAPI = {
  getDashboard: () => apiRequest('/dashboard'),
  getAnalytics: (period = 'month') =>
    apiRequest(`/analytics?period=${period}`),
  getOrders: (status = 'all', limit = 50) =>
    apiRequest(`/orders?status=${status}&limit=${limit}`),
};

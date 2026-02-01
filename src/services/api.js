import { fetchAuthSession } from 'aws-amplify/auth';

// IMPORTANT: Replace with your actual API Gateway URL
const API_BASE_URL = 'https://0wek2322jl.execute-api.ap-south-1.amazonaws.com/prod/';

/**
 * Get JWT token from current authenticated session
 */
async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
}

/**
 * Get vendor ID from JWT token
 */
async function getVendorId() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.payload?.sub;
  } catch (error) {
    console.error('Error getting vendor ID:', error);
    throw error;
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  const config = {
    ...options,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Vendor API Methods
 */
export const vendorAPI = {
  getDashboard: () => apiRequest('/dashboard'),
  getAnalytics: (period = 'month') =>
    apiRequest(`/analytics?period=${period}`),
  getOrders: (status = 'all', limit = 50) =>
    apiRequest(`/orders?status=${status}&limit=${limit}`),
};

export { getAuthToken, getVendorId };

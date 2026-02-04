import { fetchAuthSession } from 'aws-amplify/auth';

// IMPORTANT: Replace with your actual API Gateway URL
const API_BASE_URL = 'https://0wek2322jl.execute-api.ap-south-1.amazonaws.com/prod';

/**
 * Get JWT token from current authenticated session
 */
async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return token;
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
  try {
    const token = await getAuthToken();
    
    console.log('🔑 Token (first 50 chars):', token.substring(0, 50) + '...');
    console.log('🔗 Calling:', `${API_BASE_URL}${endpoint}`);
    
    const config = {
      ...options,
      headers: {
        'Authorization': token,  // Just the token, no "Bearer" prefix
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('📡 Response status:', response.status);
    
    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return JSON.parse(responseText);
    
  } catch (error) {
    console.error('❌ Request failed:', error);
    throw error;
  }
}

/**
 * Vendor API Methods - Connected to Real Backend
 */
export const vendorAPI = {
  /**
   * Get vendor dashboard data
   * GET /dashboard?period=month
   */
  getDashboard: async (period = 'month') => {
    return apiRequest(`/dashboard?period=${period}`);
  },

  /**
   * Get analytics data
   * GET /analytics?period=month
   */
  getAnalytics: async (period = 'month') => {
    return apiRequest(`/analytics?period=${period}`);
  },

  /**
   * Get vendor orders
   * GET /orders?status=all&limit=50
   */
  getOrders: async (status = 'all', limit = 50) => {
    return apiRequest(`/orders?status=${status}&limit=${limit}`);
  }
};

// Export helper functions
export { getAuthToken, getVendorId };

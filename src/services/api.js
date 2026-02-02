import { fetchAuthSession } from "aws-amplify/auth";

// API Gateway base URL
const API_BASE_URL =
  "https://0wek2322jl.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * Get ACCESS token from Cognito session (REQUIRED for API Gateway)
 */
async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString(); // ✅ FIX
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

/**
 * Get vendor ID (sub) from ID token payload (for UI use only)
 */
async function getVendorId() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.payload?.sub; // OK here
  } catch (error) {
    console.error("Error getting vendor ID:", error);
    throw error;
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`, // ✅ FIX (template literal)
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

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
  getDashboard: () => apiRequest("/dashboard"),

  getAnalytics: (period = "month") =>
    apiRequest(`/analytics?period=${period}`),

  getOrders: (status = "all", limit = 50) =>
    apiRequest(`/orders?status=${status}&limit=${limit}`),
};

export { getAuthToken, getVendorId };

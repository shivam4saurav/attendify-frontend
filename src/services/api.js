import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';

/**
 * In-memory access token storage (more secure than localStorage).
 */
let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

/**
 * Axios instance for authenticated API requests.
 * Interceptors handle token attachment and automatic refresh on 401.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — attach access token to every request.
 */
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Response interceptor — handle 401 with automatic token refresh + retry.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh once per request, and only if we had a token
    if (error.response?.status === 401 && accessToken && !originalRequest._retry) {
      originalRequest._retry = true;

      // Deduplicate concurrent refresh attempts
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Attempt to refresh the access token.
 * Returns the new access token or null if refresh fails.
 */
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );

    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return data.data.accessToken;
    }

    clearAccessToken();
    return null;
  } catch {
    clearAccessToken();
    return null;
  }
};

/**
 * Auth API — public endpoints (no token needed).
 */
export const authApi = {
  signup: (name, email, password) =>
    axios.post(`${API_URL}/api/auth/signup`, { name, email, password }, { withCredentials: true }),

  login: (email, password) =>
    axios.post(`${API_URL}/api/auth/login`, { email, password }, { withCredentials: true }),

  logout: () =>
    axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true }),

  refresh: () => refreshAccessToken(),

  getMe: () => api.get('/api/auth/me'),
};

/**
 * Attendance API — all protected.
 */
export const attendanceApi = {
  getAll: () => api.get('/api/attendance'),

  create: (subject) => api.post('/api/attendance', { subject }),

  update: (id, data) => api.put(`/api/attendance/${id}`, data),

  remove: (id) => api.delete(`/api/attendance/${id}`),
};

/**
 * Reviews API — public.
 */
export const reviewsApi = {
  getAll: (page = 1, limit = 50) => api.get(`/api/reviews?page=${page}&limit=${limit}`),

  create: (name, review) => api.post('/api/reviews', { name, review }),
};

export default api;

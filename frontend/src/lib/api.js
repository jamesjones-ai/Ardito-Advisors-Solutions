import axios from "axios";

const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// API instance for data endpoints (games, campaigns, analytics)
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// API instance for authentication endpoints (login, register)
export const authApi = axios.create({
  baseURL: `${AUTH_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  delete authApi.defaults.headers.common["Authorization"];
};

// Token refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("ardito_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await authApi.post("/auth/refresh", { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;

  localStorage.setItem("ardito_token", accessToken);
  if (newRefreshToken) {
    localStorage.setItem("ardito_refresh_token", newRefreshToken);
  }
  setAuthToken(accessToken);

  return accessToken;
};

// Response interceptor for automatic token refresh
const errorInterceptor = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Only redirect to login if refresh fails
      localStorage.removeItem("ardito_token");
      localStorage.removeItem("ardito_refresh_token");
      clearAuthToken();

      if (!window.location.hash.includes("#/login")) {
        window.location.hash = "#/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, errorInterceptor);
authApi.interceptors.response.use((response) => response, errorInterceptor);

// Initialize token from localStorage
const storedToken = localStorage.getItem("ardito_token");
if (storedToken) {
  setAuthToken(storedToken);
}

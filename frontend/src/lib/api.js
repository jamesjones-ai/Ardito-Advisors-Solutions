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

// Response interceptor for error handling
const errorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("ardito_token");
    clearAuthToken();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
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

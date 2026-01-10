import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, authApi, setAuthToken, clearAuthToken } from "@/lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("ardito_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    try {
      const response = await authApi.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("ardito_token");
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await authApi.post("/auth/login", { email, password });
    const { accessToken, user: userData } = response.data;
    localStorage.setItem("ardito_token", accessToken);
    setAuthToken(accessToken);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, name, company) => {
    const response = await authApi.post("/auth/register", { email, password, name, company });
    const { accessToken, user: userData } = response.data;
    localStorage.setItem("ardito_token", accessToken);
    setAuthToken(accessToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("ardito_token");
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../configs/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setUser(data.user);
    return data;
  };

  const register = async (email, password, name) => {
    const { data } = await api.post("/api/auth/register", { email, password, name });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/api/auth/forgot-password", { email });
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/api/auth/verify-otp", { email, otp });
    return data;
  };

  const resetPassword = async (resetToken, newPassword) => {
    const { data } = await api.post("/api/auth/reset-password", { resetToken, newPassword });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, register, logout, forgotPassword, verifyOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

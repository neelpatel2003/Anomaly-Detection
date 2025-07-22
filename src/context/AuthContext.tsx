
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/login", { email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/signup", { name, email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

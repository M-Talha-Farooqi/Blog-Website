import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log("User Data:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check for existing user session on compoenet loading
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    console.log("Authentication state changed:", isAuthenticated);
  }, [isAuthenticated]);

  return { isAuthenticated, user, login, logout };
};

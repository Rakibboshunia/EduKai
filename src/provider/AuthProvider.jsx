import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { getProfileApi } from "../api/settingsApi";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // 1. First, check localStorage for immediate UI
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 2. Then, fetch fresh data from API to ensure everything (like photo URL) is current
      try {
        const freshUser = await getProfileApi();
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        }
      } catch (error) {
        console.log("Failed to fetch fresh profile, might not be logged in or session expired.");
        // If API fails with 401, axios interceptor will handle the logout if refresh fails
      }
    };

    fetchUser();
  }, []);

  const loginUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logOutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      if (!prev) return prev;

      let isChanged = false;

      for (let key in updatedData) {
        if (prev[key] !== updatedData[key]) {
          isChanged = true;
          break;
        }
      }

      if (!isChanged) return prev;

      const newUser = { ...prev, ...updatedData };

      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    });
  }, []);

  // ✅ VERY IMPORTANT
  const value = useMemo(() => ({
    user,
    loginUser,
    logOutUser,
    updateUser
  }), [user, loginUser, logOutUser, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
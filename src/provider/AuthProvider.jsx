import { createContext, useEffect, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
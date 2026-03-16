import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

  };

  const logOutUser = () => {

    setUser(null);
    localStorage.removeItem("user");

  };

  const updateUser = (updatedData) => {

    setUser((prev) => {

      const newUser = { ...prev, ...updatedData };

      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;

    });

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logOutUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
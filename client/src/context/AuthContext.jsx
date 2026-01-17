import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin"))
  );

  const login = (token, admin) => {
    setToken(token);
    setAdmin(admin);
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

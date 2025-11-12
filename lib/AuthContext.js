import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "guest" | "logged-in" | "none"
  const [token, setToken] = useState(null);

  // Load token on mount
  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync("auth_token");
      if (!saved) setStatus("none");
      else if (saved === "guest") setStatus("guest");
      else setStatus("logged-in");
      setToken(saved);
    })();
  }, []);

  // Save token
  async function setAuthToken(value) {
    setToken(value);
    if (!value) {
      await SecureStore.deleteItemAsync("auth_token");
      setStatus("none");
    } else if (value === "guest") {
      await SecureStore.setItemAsync("auth_token", "guest");
      setStatus("guest");
    } else {
      await SecureStore.setItemAsync("auth_token", value);
      setStatus("logged-in");
    }
  }

  const value = { status, token, setAuthToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

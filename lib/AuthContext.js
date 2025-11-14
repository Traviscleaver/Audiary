import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking");
  const [token, setToken] = useState(null);

  // Unified getter
  const getStoredToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("auth_token");
    }
    return SecureStore.getItemAsync("auth_token");
  };

  // Unified setter
  const storeToken = async (value) => {
    if (Platform.OS === "web") {
      if (!value) localStorage.removeItem("auth_token");
      else localStorage.setItem("auth_token", value);
      return;
    }

    if (!value) {
      await SecureStore.deleteItemAsync("auth_token");
    } else {
      await SecureStore.setItemAsync("auth_token", value);
    }
  };

  // Load token on mount
  useEffect(() => {
    (async () => {
      const saved = await getStoredToken();

      if (!saved) {
        setToken(null);
        setStatus("guest");
      } else {
        setToken(saved);
        setStatus("logged-in");
      }
    })();
  }, []);

  // Save token
  async function setAuthToken(value) {
    await storeToken(value);

    if (!value) {
      setStatus("guest");
      setToken(null);
    } else {
      setStatus("logged-in");
      setToken(value);
    }
  }

  const value = { status, token, setAuthToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

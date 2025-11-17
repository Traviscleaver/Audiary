import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();
export let externalSetAuthToken = null;

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking");
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false); 

  externalSetAuthToken = setAuthToken; 

  // Unified getter
  const getStoredToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("auth_token");
    }
    return await SecureStore.getItemAsync("auth_token");
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

  // 🔥 Load token ONCE on mount (safe + no suspension)
  useEffect(() => {
    async function load() {
      try {
        const saved = await getStoredToken();
        console.log("🔑 Loaded saved token:", saved);

        if (saved) {
          setToken(saved);
          setStatus("logged-in");
        } else {
          setToken(null);
          setStatus("guest");
        }
      } catch (err) {
        console.log("❌ Auth load error:", err);
        setToken(null);
        setStatus("guest");
      } finally {
        setHydrated(true); // 🔥 allow render
      }
    }

    load();
  }, []);

  // ❗ Prevent **all children** from rendering until auth is hydrated
  if (!hydrated) return null;

  async function setAuthToken(value) {
    await storeToken(value);

    if (!value) {
      setToken(null);
      setStatus("guest");
    } else {
      setToken(value);
      setStatus("logged-in");
    }
  }

  return (
    <AuthContext.Provider value={{ status, token, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// lib/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

// Optional: lets you set token from outside React (use sparingly)
export let externalSetAuthToken = null;

const TOKEN_KEY = "auth_token";
const PROFILE_KEY = "auth_profile";

// ✅ Favorites cache key (must match useFavouriteData)
const FAV_CACHE_PREFIX = "fav_cache_v1_";
const favCacheKeyForUser = (userId) => `${FAV_CACHE_PREFIX}${userId}`;

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "guest" | "logged-in"
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const [hydrated, setHydrated] = useState(false);

  // ---------- Cross-platform storage helpers ----------
  const getItem = async (key) => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await SecureStore.getItemAsync(key);
  };

  const setItem = async (key, value) => {
    if (Platform.OS === "web") {
      if (!value) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
      return;
    }
    if (!value) await SecureStore.deleteItemAsync(key);
    else await SecureStore.setItemAsync(key, value);
  };

  const getStoredToken = async () => getItem(TOKEN_KEY);
  const storeToken = async (value) => setItem(TOKEN_KEY, value);

  const getStoredProfile = async () => getItem(PROFILE_KEY);
  const storeProfile = async (userObj) =>
    setItem(PROFILE_KEY, userObj ? JSON.stringify(userObj) : null);

  // ✅ Clear favourites cache (call on logout)
  async function clearFavouritesCache(userId = profile?.user_id) {
    if (!userId) return;
    try {
      await setItem(favCacheKeyForUser(userId), null);
    } catch (err) {
      console.log("❌ clearFavouritesCache error:", err);
    }
  }

  // ---------- Hydrate (load) once ----------
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const savedToken = await getStoredToken();
        const savedProfileStr = await getStoredProfile();

        let savedProfile = null;
        try {
          savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
        } catch {
          savedProfile = null;
        }

        if (!mounted) return;

        if (savedToken) {
          setToken(savedToken);
          setProfile(savedProfile);
          setStatus("logged-in");
        } else {
          setToken(null);
          setProfile(null);
          setStatus("guest");
        }
      } catch (err) {
        console.log("❌ Auth hydrate error:", err);
        if (!mounted) return;
        setToken(null);
        setProfile(null);
        setStatus("guest");
      } finally {
        if (mounted) setHydrated(true);
      }
    }

    load();

    externalSetAuthToken = setAuthToken;

    return () => {
      mounted = false;
      externalSetAuthToken = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hydrated) return null;

  // ---------- Public API ----------
  async function setAuthToken(value) {
    // value: string JWT or null
    await storeToken(value);
    
    if (!value) {
      // logging out / guest
      const oldUserId = profile?.user_id; // grab before we clear profile
      setToken(null);
      setProfile(null);
      await storeProfile(null);
      await clearFavouritesCache(oldUserId);
      setStatus("guest");
    } else {
      setToken(value);
      setStatus("logged-in");
    }
  }

  async function saveProfile(userObj) {
    setProfile(userObj || null);
    await storeProfile(userObj || null);
  }

  async function continueAsGuest() {
    await setAuthToken(null);
  }

  // ✅ One-call logout (what your button should use)
  async function logout() {
    await setAuthToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        token,
        profile,
        setAuthToken,
        saveProfile,
        continueAsGuest,
        logout,                // ✅ add
        clearFavouritesCache,  // ✅ add (optional, but useful)
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

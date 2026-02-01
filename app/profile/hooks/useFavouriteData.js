import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../../lib/AuthContext";
import { api } from "../../../lib/api";

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const FAV_KEY = (userId) => `fav_cache_v1_${userId}`;

async function getItem(key) {
  if (Platform.OS === "web") return localStorage.getItem(key);
  return await SecureStore.getItemAsync(key);
}

async function setItem(key, value) {
  if (Platform.OS === "web") {
    if (!value) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return;
  }
  if (!value) await SecureStore.deleteItemAsync(key);
  else await SecureStore.setItemAsync(key, value);
}

function safeJsonParse(str) {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export default function useFavouriteData() {
  const { status, profile } = useAuth();

  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);

  // Prevent stale async updates
  const runIdRef = useRef(0);

  const userId = profile?.user_id;
  const username = profile?.username;

  // 1) Load from cache immediately, fetch only if expired/missing
  useEffect(() => {
    if (status !== "logged-in") {
      setFavourites([]);
      setLoadingFavourites(false);
      return;
    }
    if (!userId || !username) return;

    const runId = ++runIdRef.current;

    (async () => {
      // Step A: try cache first
      const cachedStr = await getItem(FAV_KEY(userId));
      const cached = safeJsonParse(cachedStr);

      if (runId !== runIdRef.current) return;

      if (cached?.data?.length) {
        setFavourites(cached.data);
      }

      const isFresh = cached?.expiresAt && Date.now() < cached.expiresAt;
      if (isFresh) {
        return;
      }

      // Step B: cache missing/expired → fetch
      setLoadingFavourites(true);
      try {
        const res = await api(`/users/${username}/favorites`);
        if (runId !== runIdRef.current) return;

        const data = res?.favorites || [];
        setFavourites(data);

        await setItem(
          FAV_KEY(userId),
          JSON.stringify({ expiresAt: Date.now() + TTL_MS, data })
        );
      } catch (e) {
        // keep whatever we had (cached or empty)
        console.log("useFavouriteData fetch error:", e);
      } finally {
        if (runId === runIdRef.current) setLoadingFavourites(false);
      }
    })();
  }, [status, userId, username]);

  // 2) Pull-to-refresh: bypass cache and overwrite it
  const refresh = async () => {
    if (status !== "logged-in") return;
    if (!userId || !username) return;

    const runId = ++runIdRef.current;

    setLoadingFavourites(true);
    try {
      const res = await api(`/users/${username}/favorites`);
      if (runId !== runIdRef.current) return;

      const data = res?.favorites || [];
      setFavourites(data);

      await setItem(
        FAV_KEY(userId),
        JSON.stringify({ expiresAt: Date.now() + TTL_MS, data })
      );
    } catch (e) {
      if (runId !== runIdRef.current) return;
      console.log("useFavouriteData refresh error:", e);
    } finally {
      if (runId === runIdRef.current) setLoadingFavourites(false);
    }
  };

  // 3) Clear cache (useful for logout)
  const clearCache = async () => {
    if (!userId) return;
    await setItem(FAV_KEY(userId), null);
    setFavourites([]);
  };

  return {
    favourites,
    loadingFavourites,
    refresh,
    clearCache,
    setFavourites, 
  };
}

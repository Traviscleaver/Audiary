// app/profile/hooks/useProfileData.js
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { useAuth } from "../../../lib/AuthContext";
import {
  api,
  getMyProfile,
  getMyStats, // wraps getUserStats(username)
} from "../../../lib/api";

/**
 * Loads:
 * - profile (if missing) and saves to AuthContext
 * - extra datasets (stats/reviews/ratings/playlists/diary/activity)
 *
 * Favourites are handled by useFavouriteData().
 *
 * Notes:
 * - This file previously duplicated the Promise.all in two places (effect + refresh).
 * - This version dedupes with loadExtras().
 * - Optional on-device cache for extras (like favourites).
 */

const EXTRAS_CACHE_ENABLED = true; // set false if you don't want persistence yet
const TTL_MS = 15 * 60 * 1000; // 15 min (tune it)
const EXTRA_KEY = (userId) => `profile_extra_cache_v1_${userId}`;

// ---------- cross-platform storage ----------
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

export default function useProfileData() {
  const { status, profile, saveProfile } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [diary, setDiary] = useState([]);
  const [activity, setActivity] = useState([]);

  // Prevent stale async updates
  const runIdRef = useRef(0);

  const userId = profile?.user_id || null;
  const username = profile?.username || null;

  // ---------- helper: apply extras state ----------
  const applyExtras = (payload) => {
    setStats(payload?.stats || {});
    setReviews(payload?.reviews || []);
    setRatings(payload?.ratings || []);
    setPlaylists(payload?.playlists || []);
    setDiary(payload?.diary || []);
    setActivity(payload?.activity || []);
  };

  // ---------- helper: fetch extras (deduped) ----------
  const fetchExtras = async (uname) => {
    // Keep your current endpoints exactly as you used before
    const [
      statsRes,
      reviewsRes,
      ratingsRes,
      playlistsRes,
      diaryRes,
      activityRes,
    ] = await Promise.all([
      getMyStats(uname),
      api(`/users/${uname}/reviews`),
      api(`/users/${uname}/ratings`),
      api(`/users/${uname}/playlists`),
      api(`/users/${uname}/diary`),
      api(`/users/${uname}/activity`),
    ]);

    return {
      stats: statsRes?.stats || {},
      reviews: reviewsRes?.reviews || [],
      ratings: ratingsRes?.ratings || [],
      playlists: playlistsRes?.playlists || [],
      diary: diaryRes?.diary || [],
      activity: activityRes?.activity || [],
    };
  };

  // ---------- helper: load extras (cache-aware + stale-safe) ----------
  const loadExtras = async ({ bypassCache = false } = {}) => {
    if (status !== "logged-in") return;
    if (!username) return;

    const runId = ++runIdRef.current;
    setLoadingExtra(true);
    setError(null);

    try {
      // 1) hydrate from cache immediately (optional)
      if (
        EXTRAS_CACHE_ENABLED &&
        !bypassCache &&
        userId
      ) {
        const cachedStr = await getItem(EXTRA_KEY(userId));
        const cached = safeJsonParse(cachedStr);

        if (runId !== runIdRef.current) return;

        if (cached?.data) applyExtras(cached.data);

        const isFresh =
          cached?.expiresAt && Date.now() < cached.expiresAt;

        if (isFresh) {
          // If cached is fresh, stop here (no network)
          return;
        }
      }

      // 2) fetch from network
      const data = await fetchExtras(username);
      if (runId !== runIdRef.current) return;

      applyExtras(data);

      // 3) write cache
      if (EXTRAS_CACHE_ENABLED && userId) {
        await setItem(
          EXTRA_KEY(userId),
          JSON.stringify({ expiresAt: Date.now() + TTL_MS, data })
        );
      }
    } catch (e) {
      if (runId !== runIdRef.current) return;
      setError(e);
    } finally {
      if (runId !== runIdRef.current) return;
      setLoadingExtra(false);
    }
  };

  // 1) Fetch profile if missing (logged-in only)
  useEffect(() => {
    if (status !== "logged-in") return;
    if (profile) return;

    const runId = ++runIdRef.current;

    (async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const prof = await getMyProfile();
        if (runId !== runIdRef.current) return;
        await saveProfile(prof.user);
      } catch (e) {
        if (runId !== runIdRef.current) return;
        setError(e);
      } finally {
        if (runId !== runIdRef.current) return;
        setLoadingProfile(false);
      }
    })();
  }, [status, profile, saveProfile]);

  // 2) Load extras once we have username
  useEffect(() => {
    if (status !== "logged-in") {
      // on logout: clear extras state
      applyExtras({
        stats: {},
        playlists: [],
        reviews: [],
        ratings: [],
        diary: [],
        activity: [],
      });
      setLoadingProfile(false);
      setLoadingExtra(false);
      setError(null);
      return;
    }

    if (!username) return;

    // Initial load (uses cache if enabled)
    loadExtras({ bypassCache: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, username, userId]);

  // Public refresh (bypass cache)
  const refresh = async () => {
    await loadExtras({ bypassCache: true });
  };

  // Optional: clear extras cache (useful if you want to wipe on logout)
  const clearExtrasCache = async () => {
    if (!userId) return;
    await setItem(EXTRA_KEY(userId), null);
  };

  return {
    status,
    profile,
    loadingProfile,
    loadingExtra,
    error,

    stats,
    playlists,
    reviews,
    ratings,
    diary,
    activity,

    refresh,
    clearExtrasCache,
  };
}

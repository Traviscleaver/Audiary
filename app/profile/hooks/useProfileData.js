// app/profile/hooks/useProfileData.js
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../lib/AuthContext";
import { api, getMyProfile, getMyStats } from "../../../lib/api";

/**
 * Loads:
 * - profile (if missing) and saves to AuthContext
 * - extra datasets (stats/reviews/ratings/playlists/diary/activity)
 *
 * Favourites are handled by useFavouriteData().
 */
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

  const runIdRef = useRef(0);

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

  // 2) Load extra datasets once profile.username exists
  useEffect(() => {
    if (status !== "logged-in") return;
    if (!profile?.username) return;

    let cancelled = false;

    (async () => {
      setLoadingExtra(true);

      try {
        const username = profile.username;

        const [
          statsRes,
          reviewsRes,
          ratingsRes,
          playlistsRes,
          diaryRes,
          activityRes,
        ] = await Promise.all([
          getMyStats(username),
          api(`/users/${username}/reviews`),
          api(`/users/${username}/ratings`),
          api(`/users/${username}/playlists`),
          api(`/users/${username}/diary`),
          api(`/users/${username}/activity`),
        ]);

        if (cancelled) return;

        setStats(statsRes.stats || {});
        setReviews(reviewsRes.reviews || []);
        setRatings(ratingsRes.ratings || []);
        setPlaylists(playlistsRes.playlists || []);
        setDiary(diaryRes.diary || []);
        setActivity(activityRes.activity || []);
      } catch (e) {
        console.log("EXTRA LOAD ERROR", e);
      } finally {
        if (!cancelled) setLoadingExtra(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, profile?.username]);

  const refresh = async () => {
    if (status !== "logged-in") return;
    if (!profile?.username) return;

    const username = profile.username;
    const runId = ++runIdRef.current;

    setLoadingExtra(true);
    setError(null);

    try {
      const [
        statsRes,
        reviewsRes,
        ratingsRes,
        playlistsRes,
        diaryRes,
        activityRes,
      ] = await Promise.all([
        getMyStats(username),
        api(`/users/${username}/reviews`),
        api(`/users/${username}/ratings`),
        api(`/users/${username}/playlists`),
        api(`/users/${username}/diary`),
        api(`/users/${username}/activity`),
      ]);

      if (runId !== runIdRef.current) return;

      setStats(statsRes.stats || {});
      setReviews(reviewsRes.reviews || []);
      setRatings(ratingsRes.ratings || []);
      setPlaylists(playlistsRes.playlists || []);
      setDiary(diaryRes.diary || []);
      setActivity(activityRes.activity || []);
    } catch (e) {
      if (runId !== runIdRef.current) return;
      setError(e);
    } finally {
      if (runId !== runIdRef.current) return;
      setLoadingExtra(false);
    }
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
  };
}

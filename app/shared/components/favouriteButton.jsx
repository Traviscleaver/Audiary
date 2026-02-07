import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { COLORS, Feather } from "../imports";

import {
  addFavourite,
  ensureAlbum,
  ensureArtist,
  ensureTrack,
  favouritesCountByType,
  favouritesExistsBySpotify,
  removeFavourite,
} from "../../../lib/api";

/**
 * FavoriteButton
 *
 * Props:
 * - type: "Tracks" | "Albums" | "Artists"
 * - spotifyId: string
 * - initialFavorite: boolean
 * - beforeToggle?: async (nextBool) => boolean
 * - onToggle?: (nextBool) => void
 *
 * Behavior:
 * - When adding, checks /favorites/count to enforce max=3.
 * - Ensures item exists in DB (ensureTrack/ensureAlbum/ensureArtist) to get item_id
 * - POST /favorites with item_id
 * - When removing, DELETE /favorites with item_id
 */
export default function FavoriteButton({
  type,
  spotifyId,
  initialFavorite = false,
  beforeToggle,
  onToggle,
}) {
  const [isFav, setIsFav] = useState(!!initialFavorite);
  const [loading, setLoading] = useState(false);
  const [dbItemId, setDbItemId] = useState(null);

  // Prevent stale async updates
  const runIdRef = useRef(0);

  // Keep internal state synced with parent updates
  useEffect(() => {
    setIsFav(!!initialFavorite);
  }, [initialFavorite]);

  // If we don't have dbItemId yet, try to discover it via exists endpoint
  useEffect(() => {
    if (!spotifyId) return;
    const runId = ++runIdRef.current;

    (async () => {
      try {
        const res = await favouritesExistsBySpotify(type, spotifyId);
        if (runId !== runIdRef.current) return;

        if (res?.item_id) setDbItemId(res.item_id);
        // NOTE: we do NOT force-set isFav here because parent provides initialFavorite,
        // and your DetailContent already does the exists check + passes initialFavorite.
      } catch {
        // ignore
      }
    })();
  }, [type, spotifyId]);

  const uiAlertLimitReached = () => {
    Alert.alert(
      "Favourite limit reached",
      `You can only have 3 favourite ${
        type === "Tracks" ? "songs" : type === "Albums" ? "albums" : "artists"
      }.`
    );
  };

  const ensureDbIdForType = async () => {
    if (!spotifyId) return null;

    if (type === "Tracks") {
      const res = await ensureTrack(spotifyId);
      return res?.song_id ?? null;
    }
    if (type === "Albums") {
      const res = await ensureAlbum(spotifyId);
      return res?.album_id ?? null;
    }
    if (type === "Artists") {
      const res = await ensureArtist(spotifyId);
      return res?.artist_id ?? null;
    }
    return null;
  };

  const onPress = async () => {
    if (!spotifyId || loading) return;

    const next = !isFav;

    // optional hook for parent to veto toggles
    if (typeof beforeToggle === "function") {
      const ok = await beforeToggle(next);
      if (!ok) return;
    }

    setLoading(true);
    const runId = ++runIdRef.current;

    try {
      if (next === true) {
        // ✅ Client-side limit check
        const countRes = await favouritesCountByType(type);
        if ((countRes?.count ?? 0) >= 3) {
          uiAlertLimitReached();
          return;
        }

        // Ensure DB item exists and get DB id
        const id = await ensureDbIdForType();
        if (!id) {
          Alert.alert("Couldn’t favourite", "Item could not be saved to database.");
          return;
        }

        // Add favourite
        await addFavourite(type, id);

        if (runId !== runIdRef.current) return;
        setDbItemId(id);
        setIsFav(true);
        onToggle?.(true);
      } else {
        // Remove favourite requires dbItemId
        const id = dbItemId || (await ensureDbIdForType());
        if (!id) {
          // If it doesn't exist in DB, treat as not favourited
          setIsFav(false);
          onToggle?.(false);
          return;
        }

        await removeFavourite(type, id);

        if (runId !== runIdRef.current) return;
        setIsFav(false);
        onToggle?.(false);
      }
    } catch (e) {
      // Handle server max limit fallback
      const msg = String(e?.message || "");
      if (msg.includes("409") || msg.includes("FAV_MAX_REACHED")) {
        uiAlertLimitReached();
        return;
      }

      console.log("FavoriteButton error:", e);
      Alert.alert("Couldn’t update favourite", "Please try again.");
    } finally {
      if (runId === runIdRef.current) setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!spotifyId || loading}
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.divider,
        backgroundColor: COLORS.card,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.subtext} />
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Feather
            name={isFav ? "heart" : "heart"}
            size={20}
            color={isFav ? COLORS.gold : COLORS.subtext}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

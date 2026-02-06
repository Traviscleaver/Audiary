// app/shared/components/favouriteButton.jsx
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  ensureTrack,
  ensureAlbum,
  ensureArtist,
  addFavourite,
  removeFavourite,
} from "../../../lib/api";

/**
 * type: "Tracks" | "Albums" | "Artists"
 * spotifyId: Spotify ID (item.id)
 * initialFavorite: boolean (optional)
 * onToggle: (nextBool) => void
 */
export default function FavoriteButton({
  type,
  spotifyId,
  initialFavorite = false,
  onToggle,
  label = "Favorite",
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsFavorite(!!initialFavorite);
  }, [initialFavorite, spotifyId, type]);

  const prettyType = useMemo(() => {
    if (type === "Tracks") return "Tracks";
    if (type === "Albums") return "Albums";
    if (type === "Artists") return "Artists";
    return String(type || "");
  }, [type]);

  const handlePress = async () => {
    if (!spotifyId || saving) return;

    const next = !isFavorite;

    // optimistic
    setIsFavorite(next);
    onToggle?.(next);

    setSaving(true);

    try {
      let dbId = null;

      // ✅ Always ensure to get DB id
      if (type === "Tracks") {
        const res = await ensureTrack(spotifyId);
        dbId = res.song_id;
      } else if (type === "Albums") {
        const res = await ensureAlbum(spotifyId);
        dbId = res.album_id;
      } else if (type === "Artists") {
        const res = await ensureArtist(spotifyId);
        dbId = res.artist_id;
      } else {
        throw new Error(`Unknown type: ${type}`);
      }

      if (!dbId) throw new Error("Missing dbId from ensure()");

      // ✅ Toggle server
      if (next) {
        await addFavourite(prettyType, dbId);
      } else {
        await removeFavourite(prettyType, dbId);
      }
    } catch (err) {
      console.log("FavoriteButton error:", err);

      // revert
      setIsFavorite(!next);
      onToggle?.(!next);

      Alert.alert("Couldn’t update favourite", "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isFavorite && styles.active, saving && styles.disabled]}
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={!spotifyId || saving}
    >
      <Feather name="heart" size={18} color={isFavorite ? "#e63946" : "#fff"} />
      <Text style={styles.text}>{isFavorite ? "Favorited" : label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    backgroundColor: "#222",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  active: {
    backgroundColor: "#2a2a2a",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontWeight: "800",
  },
});

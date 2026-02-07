// app/review/hooks/useReviewTarget.js
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ensureTrack,
  ensureAlbum,
  getSongById,
  getAlbumById,
} from "../../../lib/api";

/**
 * useReviewTarget
 *
 * Goal:
 * - User picks something from Spotify search (track/album) OR we receive a preset spotifyId from route
 * - We "ensure" it exists in OUR DB (returns DB ids)
 * - Then we fetch hydrated display fields by DB id (song/album endpoints)
 *
 * IMPORTANT:
 * - getSongById returns { song }, getAlbumById returns { album }
 * - Songs do NOT have their own cover; we display the joined album.cover_url
 *
 * Inputs:
 * - targetType: "song" | "album"        (legacy / route default)
 * - spotifyId?: string                  (if preset, skip search)
 * - spotifyType?: "track" | "album"     (optional, but preferred when preset)
 *
 * Picker payload supported:
 * - setPickedItem(item)                                  // old
 * - setPickedItem({ spotifyType, spotifyId, item })      // new
 */
export default function useReviewTarget({ targetType, spotifyId, spotifyType }) {
  // picked selection can override route type
  const [pickedSpotifyId, setPickedSpotifyId] = useState(spotifyId || null);
  const [pickedSpotifyType, setPickedSpotifyType] = useState(spotifyType || null); // "track"|"album"|null

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prefer picked selection, else route preset
  const effectiveSpotifyId = useMemo(() => pickedSpotifyId || null, [pickedSpotifyId]);

  // Prefer picked type, else route spotifyType, else route targetType
  const effectiveTargetType = useMemo(() => {
    // If we know Spotify entity type, it wins (prevents ensureAlbum(trackId) bugs)
    const st = pickedSpotifyType || spotifyType;
    if (st === "track") return "song";
    if (st === "album") return "album";

    // fallback to route targetType
    if (targetType === "album") return "album";
    return "song";
  }, [pickedSpotifyType, spotifyType, targetType]);

  const resolve = useCallback(async () => {
    if (!effectiveTargetType) return;

    if (!effectiveSpotifyId) {
      setTarget(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ----------------------------
      // SONG (Spotify track)
      // ----------------------------
      if (effectiveTargetType === "song") {
        const ids = await ensureTrack(effectiveSpotifyId); // { song_id, album_id, artist_id, existed }
        if (!ids?.song_id) throw new Error("ensureTrack did not return song_id");

        const res = await getSongById(ids.song_id);
        const song = res?.song || res; // support either shape

        if (!song) throw new Error("getSongById did not return song");

        // ✅ album cover comes from song query join (a.cover_url)
        const imageUrl =
          song.cover_url || // recommended: your SQL selects a.cover_url as cover_url
          song.album_cover_url ||
          song.albumCover ||
          song.album_cover ||
          null;

        setTarget({
          targetType: "song",
          spotifyId: effectiveSpotifyId,
          songId: ids.song_id,
          title: song.title ?? song.name ?? "Untitled",
          subtitle:
            song.artist_name ??
            song.artist ??
            song.album_title ??
            song.album ??
            "",
          imageUrl,
          ids,
          raw: song,
        });
        return;
      }

      // ----------------------------
      // ALBUM (Spotify album)
      // ----------------------------
      if (effectiveTargetType === "album") {
        const ids = await ensureAlbum(effectiveSpotifyId); // { album_id, artist_id, existed }
        if (!ids?.album_id) throw new Error("ensureAlbum did not return album_id");

        const res = await getAlbumById(ids.album_id);
        const album = res?.album || res;

        if (!album) throw new Error("getAlbumById did not return album");

        setTarget({
          targetType: "album",
          spotifyId: effectiveSpotifyId,
          albumId: ids.album_id,
          title: album.title ?? album.name ?? "Untitled",
          subtitle: album.artist_name ?? album.artist ?? "",
          imageUrl: album.cover_url ?? album.coverUrl ?? null,
          ids,
          raw: album,
        });
        return;
      }

      throw new Error(`Unsupported targetType: ${effectiveTargetType}`);
    } catch (e) {
      setTarget(null);
      setError(e?.message || "Failed to load selection");
    } finally {
      setLoading(false);
    }
  }, [effectiveTargetType, effectiveSpotifyId, spotifyType]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  /**
   * setPickedItem
   *
   * Accepts either:
   * - setPickedItem(item)
   * - setPickedItem({ spotifyType, spotifyId, item })
   */
  const setPickedItem = useCallback((payload) => {
    // backward compatible: payload might just be the item
    const item = payload?.item ? payload.item : payload;

    const id =
      payload?.spotifyId ||
      payload?.spotify_id ||
      item?.spotifyId ||
      item?.spotify_id ||
      item?.id;

    if (!id) throw new Error("Picked item missing Spotify id");

    // accept either spotifyType or entityType naming
    const st =
      payload?.spotifyType ||
      payload?.entityType || // if you still call it entityType elsewhere
      item?.spotifyType ||
      item?.entityType ||
      null;

    // Normalize only if it’s valid
    if (st === "track" || st === "album") setPickedSpotifyType(st);

    setPickedSpotifyId(id);
  }, []);

  const clearTarget = useCallback(() => {
    setPickedSpotifyId(null);
    setPickedSpotifyType(null);
    setTarget(null);
    setError(null);
  }, []);

  return {
    target,
    loading,
    error,
    setPickedItem,
    clearTarget,
    setSpotifyId: setPickedSpotifyId,
    setSpotifyType: setPickedSpotifyType,
  };
}

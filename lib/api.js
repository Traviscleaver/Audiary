// app/lib/api.js
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

console.log("📥 Loading API_URL from env...");
function resolveApiUrl() {
  const native = Constants.expoConfig?.extra?.apiUrl;
  if (native) return native;

  const web = Constants.manifest2?.extra?.apiUrl;
  if (web) return web;

  const manifest = Constants.manifest?.extra?.apiUrl;
  if (manifest) return manifest;

  return "http://localhost:3000";
}

export const API_URL = resolveApiUrl();
console.log("🔗 API_URL Loaded:", API_URL);

// ===== Helper to read token =====
export async function getToken() {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch (err) {
    console.log("SecureStore error:", err);
    return null;
  }
}

// ===== Universal request function =====
export async function api(path, method = "GET", body) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log("🌐 API REQUEST →", {
    url: API_URL + path,
    method,
    body,
    token: token ? "(sent)" : "(none)",
  });

  let response;
  try {
    response = await fetch(API_URL + path, options);
  } catch (err) {
    console.log("❌ Network error:", err);
    throw err;
  }

  console.log("📥 RAW RESPONSE STATUS →", response.status);

  let json;
  try {
    json = await response.json();
  } catch (err) {
    console.log("⚠️ Failed to parse JSON:", err);
    json = null;
  }

  console.log("📥 PARSED JSON →", json);

  if (!response.ok) {
    // keep your existing behavior
    throw json || { error: "Unknown API error" };
  }

  return json;
}

// =====================================================
//                    PROFILE ENDPOINTS
// =====================================================
export async function getMyProfile() {
  return api("/profile");
}

export async function updateProfile(fields) {
  return api("/profile", "PUT", fields);
}

// =====================================================
//                    SEARCH ENDPOINTS
// =====================================================
export async function searchUsers(query, limit = 20) {
  const q = String(query || "").trim();
  if (q.length < 2) return { users: [] };

  const qs = `?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`;
  return api(`/users/search${qs}`);
}

// =====================================================
//                    PUBLIC USER DATA
// =====================================================
export async function getPublicProfile(username) {
  return api(`/users/${username}/profile`);
}

export async function getUserStats(username) {
  return api(`/users/${username}/stats`);
}

export async function getFullProfile(username) {
  return api(`/users/${username}/full`);
}

export async function getUserPicture(username) {
  return api(`/users/${username}/picture`);
}

// =====================================================
//                    USER CONTENT
// =====================================================
export async function getUserRatings(username) {
  return api(`/users/${username}/ratings`);
}

export async function getUserReviews(username) {
  return api(`/users/${username}/reviews`);
}

export async function getUserPlaylists(username) {
  return api(`/users/${username}/playlists`);
}

export async function getUserDiary(username) {
  return api(`/users/${username}/diary`);
}

export async function getUserFavourites(username) {
  return api(`/users/${username}/favorites`);
}

export async function getUserActivity(username) {
  return api(`/users/${username}/activity`);
}

// =====================================================
//                FAVOURITES
// =====================================================
export async function addFavourite(type, item_id, rank = null) {
  return api(`/favorites`, "POST", {
    type, // "Tracks" | "Albums" | "Artists"
    item_id, // DB id (song_id / album_id / artist_id)
    rank, // optional int (1..3) or null
  });
}

export async function removeFavourite(type, item_id) {
  return api(`/favorites`, "DELETE", { type, item_id });
}

export async function favouritesExistsBySpotify(type, spotifyId) {
  const qs = `?type=${encodeURIComponent(type)}&spotifyId=${encodeURIComponent(
    spotifyId
  )}`;
  return api(`/favorites/exists${qs}`);
}

export async function favouritesCountByType(type) {
  return api(`/favorites/count?type=${encodeURIComponent(type)}`);
}

// =====================================================
//                    ENSURE ENTITIES
// =====================================================
export async function ensureTrack(spotifyTrackId) {
  if (!spotifyTrackId) throw new Error("Missing spotifyTrackId");
  return api(`/ensure/track/${spotifyTrackId}`, "POST");
}

export async function ensureAlbum(spotifyAlbumId) {
  if (!spotifyAlbumId) throw new Error("Missing spotifyAlbumId");
  return api(`/ensure/album/${spotifyAlbumId}`, "POST");
}

export async function ensureArtist(spotifyArtistId) {
  if (!spotifyArtistId) throw new Error("Missing spotifyArtistId");
  return api(`/ensure/artist/${spotifyArtistId}`, "POST");
}

// =====================================================
//                    SONG/ALBUM LOOKUP
// =====================================================
export async function getSongById(songId) {
  return api(`/songs/${songId}`);
}

export async function getAlbumById(albumId) {
  return api(`/albums/${albumId}`);
}

export async function getAlbumBySpotifyId(spotifyId) {
  return api(`/albums/spotify/${spotifyId}`);
}

export async function getSongBySpotifyId(spotifyId) {
  return api(`/songs/spotify/${spotifyId}`);
}

// =====================================================
//                    SPOTIFY SEARCH
// =====================================================
export async function searchTracksSpotify(q) {
  return api(`/spotify/search/tracks?q=${encodeURIComponent(q)}`);
}

export async function searchAlbumsSpotify(q) {
  return api(`/spotify/search/albums?q=${encodeURIComponent(q)}`);
}

// =====================================================
//                     REVIEWS
// =====================================================
export async function upsertReview(body) {
  return api(`/reviews`, "POST", body);
}

export async function likeReview(reviewId) {
  return api(`/reviews/${encodeURIComponent(reviewId)}/like`, "POST");
}

export async function unlikeReview(reviewId) {
  return api(`/reviews/${encodeURIComponent(reviewId)}/like`, "DELETE");
}

export async function getReviewById(reviewId) {
  return api(`/reviews/${encodeURIComponent(reviewId)}`);
}

export async function getReviewsForSong(songId, limit = 50, offset = 0) {
  const qs = `?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(
    offset
  )}`;
  return api(`/reviews/songs/${encodeURIComponent(songId)}${qs}`);
}

// ✅ Top liked reviews from last 7 days
export async function getTopReviewsWeekly(limit = 20, offset = 0) {
  const qs = `?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(
    offset
  )}`;
  return api(`/reviews/top${qs}`);
}

// =====================================================
//                 REVIEW SUBMIT (UI WRAPPER)
// =====================================================
//
// ✅ Enforces:
// - ratingNumber must be 0.1–10.0
// - title is required
// - blocks album submit (server currently supports song reviews only)
//
// NOTE: Your UI now uses draft.ratingNumber. Make sure your draft actually sets it.
//
export async function submitReview({ target, draft }) {
  if (!target) throw new Error("Missing target");
  if (!draft) throw new Error("Missing draft");

  // ✅ warn/block album submits (server controller rejects album_id anyway)
  const ttype = target.spotifyType || target.targetType;
  if (ttype === "album") {
    throw new Error("Album reviews aren’t supported yet. Please pick a song.");
  }

  const spotifyId = target.spotifyId || target.spotify_id || target.id;
  if (!spotifyId) throw new Error("Missing target.spotifyId");

  // ✅ ratingNumber is 0.1–10.0
  const rating = Number(draft.ratingNumber ?? 5.0);
  if (!Number.isFinite(rating) || rating < 0.1 || rating > 10) {
    throw new Error("Rating is required (0.1–10.0).");
  }

  // ✅ title required
  const titleRaw = String(draft.title || "").trim();
  if (!titleRaw) {
    throw new Error("Title is required.");
  }

  const title = titleRaw;
  const content = String(draft.content || "").trim() || null;

  // SONG ONLY (matches your reviews schema)
  const ensured = await ensureTrack(spotifyId);
  const song_id = ensured?.song_id ?? ensured?.id ?? ensured?.songId;
  if (!song_id) throw new Error("ensureTrack did not return song_id");

  return upsertReview({ song_id, rating, title, content });
}

// =====================================================
//                PROFILE BLOCKS (layout)
// =====================================================

// Get my ordered profile blocks
export async function getMyProfileBlocks() {
  return api(`/profile/blocks`);
}

/**
 * Create a profile block.
 * block_type: "favorites" | "stats" | "playlist"
 * subtype: required for favorites/stats (ex: "Albums", "Tracks", "Artists", "activity")
 * ref_id: required for playlist (playlist_id)
 */
export async function createProfileBlock({ block_type, subtype = null, ref_id = null }) {
  return api(`/profile/blocks`, "POST", { block_type, subtype, ref_id });
}

/**
 * Update a block (display and/or rank)
 * fields: { display?: boolean, rank?: number }
 */
export async function updateProfileBlock(profile_block_id, fields) {
  return api(`/profile/blocks/${encodeURIComponent(profile_block_id)}`, "PATCH", fields);
}

/**
 * Bulk reorder blocks
 * order: [{ profile_block_id: number, rank: number }, ...]
 */
export async function reorderProfileBlocks(order) {
  return api(`/profile/blocks/reorder`, "POST", { order });
}

// Delete a block from the profile layout
export async function deleteProfileBlock(profile_block_id) {
  return api(`/profile/blocks/${encodeURIComponent(profile_block_id)}`, "DELETE");
}

/**
 * Convenience: toggle block visibility
 */
export async function setProfileBlockDisplay(profile_block_id, display) {
  return updateProfileBlock(profile_block_id, { display: !!display });
}

// Reorder favourites (within a type bucket)
export async function reorderFavourites(type, order) {
  // type: "Albums" | "Tracks" | "Artists"
  // order: [{ item_id: number, rank: number }, ...]
  return api(`/favorites/reorder`, "POST", { type, order });
}

export async function uploadMyAvatar(localUri) {
  const token = await getToken();
  const form = new FormData();

  const filename = localUri.split("/").pop() || "avatar.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

  form.append("file", { uri: localUri, name: filename, type });

  const res = await fetch(API_URL + "/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // DO NOT set Content-Type manually for multipart
    },
    body: form,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw json || { error: "Upload failed" };
  return json;
}

// =====================================================
//                WRAPPER FOR PROFILE
// =====================================================
export async function getMyStats(username) {
  return getUserStats(username);
}
export async function getMyRatings(username) {
  return getUserRatings(username);
}
export async function getMyReviews(username) {
  return getUserReviews(username);
}
export async function getMyPlaylists(username) {
  return getUserPlaylists(username);
}
export async function getMyDiary(username) {
  return getUserDiary(username);
}
export async function getMyFavourites(username) {
  return getUserFavourites(username);
}
export async function getMyActivity(username) {
  return getUserActivity(username);
}
export async function getMyFullProfile(username) {
  return getFullProfile(username);
}

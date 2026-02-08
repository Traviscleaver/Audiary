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
export async function addFavourite(type, item_id) {
  return api(`/favorites`, "POST", { type, item_id });
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
export async function submitReview({ target, draft }) {
  if (!target) throw new Error("Missing target");
  if (!draft) throw new Error("Missing draft");

  const spotifyId = target.spotifyId || target.spotify_id || target.id;
  if (!spotifyId) throw new Error("Missing target.spotifyId");

  const rating = Number(draft.stars || 0);
  if (!Number.isFinite(rating) || rating <= 0) {
    throw new Error("Rating is required");
  }

  const title = String(draft.title || "").trim() || null;     // ✅ added
  const content = String(draft.content || "").trim() || null;

  // SONG ONLY (matches your reviews schema)
  const ensured = await ensureTrack(spotifyId);
  const song_id = ensured?.song_id ?? ensured?.id ?? ensured?.songId;
  if (!song_id) throw new Error("ensureTrack did not return song_id");

  return upsertReview({ song_id, rating, title, content });    // ✅ added title
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

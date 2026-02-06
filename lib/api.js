// api.js
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// const API_URL = process.env.API_URL;
// const API_URL = "http://localhost:3000"; // TEMP FOR TESTING
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

  // ========= DEBUG LOGS =========
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

// Logged-in user's own profile
export async function getMyProfile() {
  return api("/profile");
}

// Update your own profile
export async function updateProfile(fields) {
  return api("/profile", "PUT", fields);
}

// =====================================================
//                    PUBLIC USER DATA
// =====================================================

// Public profile lookup
export async function getPublicProfile(username) {
  return api(`/users/${username}/profile`);
}

// User stats (reviews, ratings, listens)
export async function getUserStats(username) {
  return api(`/users/${username}/stats`);
}

// Full bundled profile
export async function getFullProfile(username) {
  return api(`/users/${username}/full`);
}

// =====================================================
//                    USER CONTENT
// =====================================================

// User ratings list
export async function getUserRatings(username) {
  return api(`/users/${username}/ratings`);
}

// User reviews list
export async function getUserReviews(username) {
  return api(`/users/${username}/reviews`);
}

// Playlists created by user
export async function getUserPlaylists(username) {
  return api(`/users/${username}/playlists`);
}

// Diary entries
export async function getUserDiary(username) {
  return api(`/users/${username}/diary`);
}

// Favourites (songs, albums, artists)
export async function getUserFavourites(username) {
  return api(`/users/${username}/favorites`);
}

// Recent activity
export async function getUserActivity(username) {
  return api(`/users/${username}/activity`);
}



// =====================================================
//                FAVOURITES
// =====================================================

export async function addFavourite(type, item_id) {
  return api(`/favorites`, "POST", {
    type,          // "Tracks" | "Albums" | "Artists"
    item_id,       // DB id (song_id / album_id / artist_id)
  });
}

export async function removeFavourite(type, item_id) {
  return api(`/favorites`, "DELETE", {
    type,
    item_id,
  });
}

export async function favouritesExistsBySpotify(type, spotifyId) {
  const qs = `?type=${encodeURIComponent(type)}&spotifyId=${encodeURIComponent(spotifyId)}`;
  return api(`/favorites/exists${qs}`);
}




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

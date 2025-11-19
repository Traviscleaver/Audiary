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
// const API_URL = "https://robust-moderators-aug-nextel.trycloudflare.com"
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
  return api("/profile"); // correct backend route
}

// Stats need username path
export async function getMyStats(username) {
  return api(`/users/${username}/stats`);
}

// Update your own profile
export async function updateProfile(fields) {
  return api("/profile", "PUT", fields);
}

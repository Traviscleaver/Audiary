import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// ------------------------------
// API URL FROM ENV
// ------------------------------
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

// ------------------------------
// Storage helpers (web + mobile)
// ------------------------------
export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("auth_token");
  }
  return SecureStore.getItemAsync("auth_token");
}

export async function setToken(token) {
  if (Platform.OS === "web") {
    if (!token) localStorage.removeItem("auth_token");
    else localStorage.setItem("auth_token", token);
    return;
  }

  if (!token) {
    await SecureStore.deleteItemAsync("auth_token");
  } else {
    await SecureStore.setItemAsync("auth_token", token);
  }
}

// ------------------------------
// API helper
// ------------------------------
export async function api(path, init = {}) {
  const token = await getToken();
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${API_URL}${path}`;
  console.log("📡 FETCH →", url);

  return fetch(url, {
    ...init,
    headers
  });
}

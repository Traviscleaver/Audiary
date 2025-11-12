// lib/authClient.js (place this OUTSIDE the app/ folder)
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Pick ONE base URL that matches your setup:
 *
 * - Android emulator (AVD): http://10.0.2.2:3000  ✅ most common for Android dev
 * - iOS simulator:          http://127.0.0.1:3000
 * - Physical device:        http://<your-computer-LAN-IP>:3000  (e.g., http://192.168.0.23:3000)
 */
const DEFAULTS = {
  androidEmu: "http://10.0.2.2:3000",
  iosSim: "http://127.0.0.1:3000",
  lan: "http://192.168.0.23:3000" // change this to your actual LAN IP if using a phone on Wi-Fi
};

// Choose a sensible default; you can switch this if needed.
export const API_URL =
  Platform.OS === "android" ? DEFAULTS.androidEmu : DEFAULTS.iosSim;
// If you’re on a physical device, change to:
// export const API_URL = DEFAULTS.lan;

export async function getToken() {
  return SecureStore.getItemAsync("auth_token");
}

export async function setToken(token) {
  return SecureStore.setItemAsync("auth_token", token);
}

/** fetch with timeout (abort) so we don’t hang forever */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function api(path, init = {}, timeoutMs = 8000) {
  const token = await getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  return fetchWithTimeout(`${API_URL}${path}`, { ...init, headers }, timeoutMs);
}

export default { API_URL, api, getToken, setToken, fetchWithTimeout };

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// const DEFAULTS = {
//   android: "http://10.0.2.2:3000",
//   ios: "http://127.0.0.1:3000",
//   web: "http://127.0.0.1:3000"
// };
const DEFAULTS = {
  android: "http://172.18.123.162:3000",
  ios: "http://172.18.123.162:3000",
  web: "http://172.18.123.162:3000"
};

export const API_URL =
  Platform.OS === "android"
    ? DEFAULTS.android
    : DEFAULTS.ios;

// export const API_URL =
//   Platform.OS === "android"
//     ? DEFAULTS.android
//     : Platform.OS === "ios"
//     ? DEFAULTS.ios
//     : DEFAULTS.web; // web fallbacks

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

  console.log("FETCH →", `${API_URL}${path}`);

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });
}

import { router } from "expo-router";
import { externalSetAuthToken } from "./AuthContext";

export async function logout() {
  try {
    await externalSetAuthToken(null); // clear token globally
    router.replace("/(auth)/LoginScreen");
    console.log("User logged out.");
  } catch (err) {
    console.log("Logout error:", err);
  }
}

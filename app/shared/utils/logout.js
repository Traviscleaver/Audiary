// app/shared/utils/logout.js
import { router } from "expo-router";

export async function logout(setAuthToken, setProfile, setFavourites) {
  try {
    // ✅ 1) Leave the protected screen first (prevents AuthGate popping)
    router.replace("/LoginScreen");

    // ✅ 2) Then clear state/storage
    if (typeof setFavourites === "function") setFavourites([]);
    await setProfile(null);
    await setAuthToken(null);
  } catch (e) {
    console.log("logout error:", e);
    // If anything fails, still try to land on Login
    router.replace("/LoginScreen");
  }
}

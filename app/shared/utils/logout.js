// app/shared/utils/logout.js
import { router } from "expo-router";

export async function logout(setAuthToken) {
  try {
    if (typeof setFavourites === "function") setFavourites([]);
    await setAuthToken(null);
    console.log("✅ Logged out successfully");
  } catch (e) {
    console.log("LOGOUT FAILED:", e);
  } finally {
    router.replace("/LoginScreen");
  }


}

// app/shared/utils/logout.js
import { router } from "expo-router";

export async function logout(setAuthToken, setProfile) {
  try {
    await setAuthToken(null);
    await setProfile(null);
  } finally {
    router.replace("/LoginScreen");
  }
}

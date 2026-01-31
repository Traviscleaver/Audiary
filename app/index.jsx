import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext"; // adjust path

export default function Index() {
  const router = useRouter();
  const { status } = useAuth(); // "checking" | "guest" | "logged-in"

  useEffect(() => {
    if (status === "checking") return; // not ready yet

    if (status === "logged-in") {
      router.replace("/home");
    } else {
      router.replace("/LoginScreen");
    }
  }, [status, router]);

  return null; // render nothing while redirecting
}

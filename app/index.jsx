import { Redirect } from "expo-router";

export default function Index() {
  // Always send guests straight to /home without using router.push
  return <Redirect href="/LoginScreen" />;
}

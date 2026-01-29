// import { Stack } from "expo-router";
// import React from "react";
// import { AuthProvider } from "../lib/AuthContext";

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: "none",
//           gestureEnabled: false,
//           contentStyle: { backgroundColor: "#121212",
//           }
//         }}
//       />
//     </AuthProvider>
//   );
// }
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../lib/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { status } = useAuth();

  // 🛑 DO NOT RENDER ANYTHING until AuthProvider finishes loading the token
  if (status === "checking") {
    return null; // or a splash screen
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        gestureEnabled: false,
        contentStyle: {
          backgroundColor: "#121212",
        },
      }}
    />
  );
}

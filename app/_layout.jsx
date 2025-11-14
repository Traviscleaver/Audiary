import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          gestureEnabled: false,
          contentStyle: { backgroundColor: "#121212",
          }
        }}
      />
    </AuthProvider>
  );
}

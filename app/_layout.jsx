import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#121212" }
        }}
      />
    </AuthProvider>
  );
}

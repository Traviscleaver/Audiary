// app/_layout.jsx
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import React from "react";

import { AuthProvider, useAuth } from "../lib/AuthContext";
import { ReviewOverlayProvider } from "./shared/components/review/ReviewOverlayProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ReviewOverlayProvider>
          <RootStack />
        </ReviewOverlayProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
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

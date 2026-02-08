// app/_layout.jsx
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../lib/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootStack />
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

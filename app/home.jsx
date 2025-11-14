import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "../lib/AuthContext";

export default function Home() {
  const { status, token } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Status: {status}</Text>
      <Text style={styles.token}>Token: {token || "none"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center"
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#bfc6cf", marginTop: 8 },
  token: { color: "#999", fontSize: 12, marginTop: 12 }
});

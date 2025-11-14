import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { setAuthToken } = useAuth();

  async function onLogout() {
    await setAuthToken(null); // clear token
    router.replace("/(auth)/LoginScreen"); // go to login
  }

  return (
    <TouchableOpacity style={styles.btn} onPress={onLogout}>
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#1c1c1e",
    borderColor: "#2e2e2e",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20
  },
  text: {
    color: "#ff5757",
    fontWeight: "700",
    fontSize: 16
  }
});

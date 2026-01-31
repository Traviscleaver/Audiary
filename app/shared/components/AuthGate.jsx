// app/shared/components/AuthGate.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../lib/AuthContext"; // adjust path if needed

export default function AuthGate({
  children,
  mode = "onEnter", // "onEnter" | "onAction"
  title = "Login required",
  message = "You need an account to use this feature.",
  loginRoute = "/(auth)/LoginScreen",
  onCancel = "back", // "back" | "stay"
}) {
  const router = useRouter();
  const { status } = useAuth();

  const [visible, setVisible] = useState(false);

  // ✅ Auto-open when entering the screen (if guest)
  useEffect(() => {
    if (mode !== "onEnter") return;
    if (status === "logged-in") return;
    setVisible(true);
  }, [mode, status]);

  // ✅ Reusable for button gating too (if you ever want it)
  const gate = useCallback(
    (action) => {
      if (status === "logged-in") return action?.();
      setVisible(true);
    },
    [status]
  );

  const handleNotNow = () => {
    setVisible(false);

    if (onCancel === "back") {
      // go back to previous page
      if (router.canGoBack?.()) router.back();
      else router.replace("/"); // fallback if no history
    }
  };

  const handleLogin = () => {
    setVisible(false);
    router.push(loginRoute);
  };

  // If mode is onEnter, just render children normally (page exists, modal blocks)
  // If mode is onAction, allow function-as-children to use gate()
  const content =
    typeof children === "function" ? children(gate) : children;

  return (
    <>
      {content}

      <Modal 
        visible={visible} 
        transparent 
        animationType="fade" 
        presentationStyle="overFullScreen"     // ✅ iOS: allow seeing underlying screen
        statusBarTranslucent={true}  
        onRequestClose={handleNotNow}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.row}>
              <TouchableOpacity style={styles.secondary} onPress={handleNotNow}>
                <Text style={styles.secondaryText}>Not now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primary} onPress={handleLogin}>
                <Text style={styles.primaryText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  message: { color: "#bfc6cf", marginTop: 8 },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  primary: {
    backgroundColor: "#1db954",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryText: { color: "#000", fontWeight: "700" },
  secondary: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryText: { color: "#fff", fontWeight: "600" },
});

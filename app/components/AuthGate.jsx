import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

console.log("📥 Loading AuthGate component...");


// Unified token getter
async function getStoredToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("auth_token");
  }
  return SecureStore.getItemAsync("auth_token");
}

export default function AuthGate({ children }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [queuedAction, setQueuedAction] = useState(null);

  const checkToken = useCallback(async () => {
    try {
      const token = await getStoredToken();
      return !!token; // true = logged in, false = guest
    } catch {
      return false;
    }
  }, []);

  const gate = useCallback(
    async (action) => {
      const authed = await checkToken();

      if (authed) {
        action && action();
        return;
      }

      // Not logged in → show modal
      setQueuedAction(() => action);
      setVisible(true);
    },
    [checkToken]
  );

  const close = () => setVisible(false);

  const goLogin = () => {
    setVisible(false);
    router.push("/(auth)/LoginScreen");
  };

  const continueGuest = () => {
    // They stay as guest, modal closes.
    setVisible(false);
  };

  // Support function-as-children or regular children
  const content =
    typeof children === "function" ? children(gate) : children;

  return (
    <>
      {content}

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Login required</Text>
            <Text style={styles.message}>
              You need an account to use this feature.
            </Text>

            <View style={styles.row}>
              <TouchableOpacity style={styles.secondary} onPress={continueGuest}>
                <Text style={styles.secondaryText}>Not now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primary} onPress={goLogin}>
                <Text style={styles.primaryText}>Log in</Text>
              </TouchableOpacity>
            </View>

            {/* Optional: Run protected action anyway as guest
            <TouchableOpacity
              style={[styles.secondary, { marginTop: 10 }]}
              onPress={() => {
                setVisible(false);
                queuedAction?.();
                setQueuedAction(null);
              }}
            >
              <Text style={styles.secondaryText}>Do it anyway</Text>
            </TouchableOpacity>
            */}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    width: "100%",
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2a2a2a"
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  message: { color: "#bfc6cf", marginTop: 8 },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10
  },
  primary: {
    backgroundColor: "#1db954",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  primaryText: { color: "#000", fontWeight: "700" },
  secondary: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  secondaryText: { color: "#fff", fontWeight: "600" }
});

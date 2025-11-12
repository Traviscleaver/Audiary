import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

/**
 * AuthGate
 * --------
 * A reusable wrapper that asks users to log in only when an action requires it.
 *
 * Usage:
 *   <AuthGate>
 *     <TouchableOpacity onPress={() => onDoProtectedThing()}>
 *       <Text>Write a Review</Text>
 *     </TouchableOpacity>
 *   </AuthGate>
 *
 * Inside, call `gate(() => protectedAction())` to guard an action:
 *   const { gate } = useAuthGate();
 *   <TouchableOpacity onPress={() => gate(() => doSomething()))} />
 *
 * But this component exposes a render prop for convenience:
 *   <AuthGate>
 *     {(gate) => (
 *       <TouchableOpacity onPress={() => gate(() => doProtected()))}>
 *         <Text>Protected</Text>
 *       </TouchableOpacity>
 *     )}
 *   </AuthGate>
 */

export default function AuthGate({ children }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [queuedAction, setQueuedAction] = useState(null);

  const checkToken = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      return !!token; // if you ever add real logins, this will be true when logged in
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
      // not authed → open modal and queue the action
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
    // They chose to remain guest → just close modal, do not run protected action.
    // (If you want to run it anyway, call queuedAction?.() here instead.)
    setVisible(false);
  };

  // Allow both child-as-element and child-as-function(gate)
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
              <TouchableOpacity
                style={styles.primary}
                onPress={goLogin}
              >
                <Text style={styles.primaryText}>Log in</Text>
              </TouchableOpacity>
            </View>

            {/* If you want “Run anyway as guest”, uncomment below:
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

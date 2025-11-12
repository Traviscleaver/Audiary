import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { setAuthToken } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setLoading(true);
      // Replace with actual API later
      await setAuthToken("FAKE_LOGIN_TOKEN");
      router.replace("/home");
    } catch (e) {
      Alert.alert("Error", e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSkip() {
    await setAuthToken("guest");
    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Audiary</Text>
          <Text style={styles.subtitle}>
            {mode === "login" ? "Sign in to continue" : "Create an account"}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9aa4af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {mode === "register" && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9aa4af"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9aa4af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.primaryText}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => setMode(mode === "login" ? "register" : "login")}
            disabled={loading}
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "No account? Create one"
                : "Have an account? Sign in"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.ghostBtn} onPress={onSkip}>
            <Text style={styles.ghostText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  header: { marginBottom: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#bfc6cf", marginTop: 6, fontSize: 16 },
  form: { gap: 12 },
  input: {
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#262626"
  },
  primaryBtn: {
    backgroundColor: "#1db954",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6
  },
  primaryText: { color: "#000", fontWeight: "700", fontSize: 16 },
  switchMode: { alignItems: "center", marginTop: 10 },
  switchText: { color: "#9aa4af" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 8
  },
  divider: { flex: 1, height: 1, backgroundColor: "#232323" },
  dividerLabel: { color: "#9aa4af" },
  ghostBtn: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  ghostText: { color: "#fff", fontWeight: "600" }
});

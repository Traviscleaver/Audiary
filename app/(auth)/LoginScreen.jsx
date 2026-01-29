// app/(auth)/LoginScreen.js
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../lib/api.js";
import { useAuth } from "../../lib/AuthContext.js";

export default function LoginScreen() {
  const { setAuthToken } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onLogin() {
    try {
      setErrorMsg("");
      setLoading(true);

      const data = await api(
        "/auth/login",
        "POST",
        { email, password }
      );

      await setAuthToken(data.token);

      router.replace("/home");

    } catch (err) {
      console.log("🔥 Login error:", err);
      setErrorMsg(err?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }


  function onGuest() {
    setAuthToken(null); // no token = guest mode
    router.replace("/home");
  }

  function goRegister() {
    router.push("/(auth)/RegisterScreen");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Audiary</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          {errorMsg !== "" && (
            <Text style={styles.error}>{errorMsg}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9aa4af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

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
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goRegister} style={{ marginTop: 12 }}>
            <Text style={{ color: "#9aa4af", textAlign: "center" }}>
              No account? Create one
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.ghostBtn} onPress={onGuest}>
            <Text style={styles.ghostText}>Continue as Guest</Text>
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
  error: { color: "#ff5b5b", marginBottom: 8, fontSize: 14 },
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

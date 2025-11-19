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
// import { api, setToken } from "../../lib/AuthClient";
import { api } from "../../lib/api.js";
import { useAuth } from "../../lib/AuthContext.js";

export default function RegisterScreen() {
  const { setAuthToken } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onRegister() {
    try {
      setErrorMsg("");
      setLoading(true);

      // api() returns parsed JSON directly
      const data = await api(
        "/auth/register",
        "POST",
        { email, username, password }
      );

      await setAuthToken(data.token);
      router.replace("/home");

    } catch (err) {
      console.log("🔥 Register error:", err);
      setErrorMsg(err?.error || "Could not register.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Audiary Account</Text>
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
            placeholder="Username"
            placeholderTextColor="#9aa4af"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
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
            onPress={onRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#9aa4af", textAlign: "center" }}>
              Already have an account? Sign in
            </Text>
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
  title: { color: "#fff", fontSize: 24, fontWeight: "700" },
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
  primaryText: { color: "#000", fontWeight: "700", fontSize: 16 }
});

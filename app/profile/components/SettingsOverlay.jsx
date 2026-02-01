import { useRouter } from "expo-router";
import { updateProfile } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";
// import {  onLogout } from "./LogoutButton"
import { logout } from "../../shared/utils/logout";
import useFavouriteData from "../hooks/useFavouriteData";
import {
  Animated,
  COLORS,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "../../shared/imports";

export default function SettingsOverlay({
  settingsAnim,
  closeSettings,

  // Current values
  handle,
  setHandle,
  givenName,
  setGivenName,
  familyName,
  setFamilyName,
  email,
  openEmailOverlay,
  location,
  setLocation,
  website,
  setWebsite,
  openBioOverlay,
  pronoun,

  // Avatar is passed from Profile.jsx (even if we don't edit it here yet)
  avatarUrl,
  setAvatarUrl,

  // Parent callback
  onSave,
}) {
  const router = useRouter();
  const { setAuthToken } = useAuth();
  const { setFavourites } = useFavouriteData();

  const handleSave = async () => {
    try {
      const trimmedHandle = handle?.trim() || null;
      const trimmedEmail = email?.trim() || null;
      const trimmedGiven = givenName?.trim() || "";
      const trimmedFamily = familyName?.trim() || "";
      const displayName = (trimmedGiven + " " + trimmedFamily).trim() || null;

      const payload = {
        // USERS table
        username: trimmedHandle,
        email: trimmedEmail,
        display_name: displayName,
        avatar_url: avatarUrl || null,

        // USER_PROFILES table
        first_name: trimmedGiven || null,
        last_name: trimmedFamily || null,
        location: (location || "").trim() || null,
        website: (website || "").trim() || null,

        // bio handled in BioOverlay, so leave this alone here
        // bio: null,
      };

      const res = await updateProfile(payload);

      if (onSave && res?.user) {
        onSave(res.user);
      }

      closeSettings();
    } catch (err) {
      console.error("Profile update error:", err);
      const msg =
        err?.error ||
        err?.message ||
        "Failed to update profile. Please try again.";
      alert(msg);
    }
  };

  return (
    <Animated.View style={[styles.settingsOverlay, { opacity: settingsAnim }]}>
      {/* BACKDROP */}
      <TouchableOpacity
        onPress={closeSettings}
        style={styles.overlayBackground}
        activeOpacity={1}
      />

      {/* SLIDING SHEET */}
      <Animated.View
        style={[
          styles.settingsSheet,
          {
            height: "92%",
            transform: [
              {
                translateY: settingsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [700, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={closeSettings}>
            <Text style={styles.sheetCancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Settings</Text>

          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.sheetSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* ACCOUNT */}
          <Text style={styles.smallHeader}>ACCOUNT</Text>

          {/* USERNAME */}
          <View style={styles.rowEditable}>
            <Text style={styles.editLabel}>Username</Text>
            <TextInput
              value={handle}
              onChangeText={setHandle}
              placeholder="Username"
              placeholderTextColor={COLORS.faint}
              style={styles.editInput}
              maxLength={36}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          </View>

          {/* PASSWORD */}
          <TouchableOpacity style={styles.rowTouchable}>
            <Text style={styles.editLabel}>Password and authentication</Text>
          </TouchableOpacity>

          {/* SIGN OUT */}
          <TouchableOpacity style={styles.rowTouchable} onPress={() => logout(setAuthToken, setFavourites)}>
            <Text style={[styles.editLabel, { color: COLORS.danger }]}>
              Sign out
            </Text>
          </TouchableOpacity>

          {/* PROFILE */}
          <Text style={styles.smallHeader}>PROFILE</Text>

          {/* GIVEN NAME */}
          <View style={styles.rowEditable}>
            <Text style={styles.editLabel}>Given name</Text>
            <TextInput
              value={givenName}
              onChangeText={setGivenName}
              placeholder="Given name"
              placeholderTextColor={COLORS.faint}
              style={styles.editInput}
            />
          </View>

          {/* FAMILY NAME */}
          <View style={styles.rowEditable}>
            <Text style={styles.editLabel}>Family name</Text>
            <TextInput
              value={familyName}
              onChangeText={setFamilyName}
              placeholder="Family name"
              placeholderTextColor={COLORS.faint}
              style={styles.editInput}
            />
          </View>

          {/* EMAIL */}
          <TouchableOpacity
            style={styles.rowTouchable}
            onPress={openEmailOverlay}
          >
            <Text style={styles.editLabel}>Email address</Text>
            <Text style={styles.editValue}>{email}</Text>
          </TouchableOpacity>

          {/* LOCATION */}
          <View style={styles.rowEditable}>
            <Text style={styles.editLabel}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
              placeholderTextColor={COLORS.faint}
              style={styles.editInput}
            />
          </View>

          {/* WEBSITE */}
          <View style={styles.rowEditable}>
            <Text style={styles.editLabel}>Website</Text>
            <TextInput
              value={website}
              onChangeText={setWebsite}
              placeholder="Website"
              placeholderTextColor={COLORS.faint}
              style={styles.editInput}
            />
          </View>

          {/* BIO */}
          <TouchableOpacity
            style={styles.rowTouchable}
            onPress={openBioOverlay}
          >
            <Text style={styles.editLabel}>Bio</Text>
          </TouchableOpacity>

          {/* PRONOUN (frontend-only for now) */}
          <TouchableOpacity style={styles.rowTouchable}>
            <Text style={styles.editLabel}>Pronoun</Text>
            <Text style={styles.editValue}>{pronoun}</Text>
          </TouchableOpacity>

          <View style={{ height: 80 }} />
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

/* --------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  settingsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 3000,
  },

  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  settingsSheet: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  sheetCancel: { color: COLORS.subtext, fontSize: 16 },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  sheetSave: { color: COLORS.active, fontSize: 16, fontWeight: "700" },

  smallHeader: {
    fontSize: 13,
    color: COLORS.subtext,
    marginLeft: 16,
    marginTop: 18,
    marginBottom: 6,
  },

  rowEditable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editLabel: {
    color: COLORS.text,
    fontSize: 16,
  },

  editInput: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "right",
    padding: 0,
    margin: 0,
    minWidth: 80,
    flex: 1,
    maxWidth: "70%",
  },

  editValue: {
    color: COLORS.subtext,
    fontSize: 16,
    maxWidth: "100%",
    textAlign: "right",
  },
});

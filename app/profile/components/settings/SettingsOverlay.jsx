// app/profile/components/settings/SettingsOverlay.jsx
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { updateProfile } from "../../../../lib/api.js";
import { useAuth } from "../../../../lib/AuthContext.js";

import {
  Animated,
  COLORS,
  TouchableOpacity,
  View,
  useSafeAreaInsets,
  useState,
} from "../../../shared/imports";

import { logout } from "../../../shared/utils/logout";
import useFavouriteData from "../../hooks/useFavouriteData";

import BlockedOverlay from "./BlockedOverlay";
import PasswordPopup from "./PasswordPopup";
import SettingsSheet from "./SettingsSheet";
import { overlayStyles as styles } from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * SettingsOverlay = "orchestrator":
 * - owns animation + local popup/subOverlay state
 * - performs save API call
 * - composes subcomponents that render UI
 */
export default function SettingsOverlay(props) {
  const {
    settingsAnim,
    closeSettings,

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
    bio,
    setBio,
    openBioOverlay,
    pronoun,

    avatarUrl,
    setAvatarUrl,

    onSave,
  } = props;

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuthToken } = useAuth();

  // ⚠️ keeping your original call pattern
  const { setFavourites } = useFavouriteData();

  const [activityOn, setActivityOn] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);

  // Sub overlay only
  const [subOverlay, setSubOverlay] = useState(null); // "blocked" | null
  const subAnim = useState(() => new Animated.Value(0))[0];

  const openSubOverlay = (key) => {
    setSubOverlay(key);
    subAnim.setValue(0);
    Animated.timing(subAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  const closeSubOverlay = () => {
    Animated.timing(subAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(
      ({ finished }) => finished && setSubOverlay(null)
    );
  };

  const handleSave = async () => {
    try {
      const trimmedHandle = handle?.trim() || null;
      const trimmedEmail = email?.trim() || null;
      const trimmedGiven = givenName?.trim() || "";
      const trimmedFamily = familyName?.trim() || "";
      const displayName = (trimmedGiven + " " + trimmedFamily).trim() || null;

      const payload = {
        username: trimmedHandle,
        email: trimmedEmail,
        display_name: displayName,
        avatar_url: avatarUrl || null,

        first_name: trimmedGiven || null,
        last_name: trimmedFamily || null,
        location: (location || "").trim() || null,
        website: (website || "").trim() || null,
      };

      const res = await updateProfile(payload);
      if (onSave && res?.user) onSave(res.user);

      closeSettings();
    } catch (err) {
      console.error("Profile update error:", err);
      const msg =
        err?.error || err?.message || "Failed to update profile. Please try again.";
      alert(msg);
    }
  };

  const sheetTranslateX = settingsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0],
    extrapolate: "clamp",
  });

  const PANEL_TOP = insets.top;

  const handleBackgroundPress = () => {
    if (passwordPopupOpen) return setPasswordPopupOpen(false);
    if (subOverlay) return closeSubOverlay();
    closeSettings();
  };

  const handleBackPress = () => {
    if (passwordPopupOpen) return setPasswordPopupOpen(false);
    if (subOverlay) return closeSubOverlay();
    closeSettings();
  };

  return (
    <View style={styles.root}>
      {/* fills whole screen with COLORS.screen */}
      <Animated.View
        style={[
          styles.screenFill,
          { opacity: settingsAnim, backgroundColor: COLORS.screen },
        ]}
        pointerEvents="none"
      />

      <TouchableOpacity
        style={styles.overlayBackground}
        activeOpacity={1}
        onPress={handleBackgroundPress}
      />

      <SettingsSheet
        top={PANEL_TOP}
        translateX={sheetTranslateX}
        onBack={handleBackPress}
        onSave={handleSave}
        // content props
        handle={handle}
        setHandle={setHandle}
        givenName={givenName}
        setGivenName={setGivenName}
        familyName={familyName}
        setFamilyName={setFamilyName}
        email={email}
        openEmailOverlay={openEmailOverlay}
        location={location}
        setLocation={setLocation}
        website={website}
        setWebsite={setWebsite}
        bio={bio}
        setBio={setBio}
        openBioOverlay={openBioOverlay}
        activityOn={activityOn}
        setActivityOn={setActivityOn}
        notificationsOn={notificationsOn}
        setNotificationsOn={setNotificationsOn}
        onOpenPassword={() => setPasswordPopupOpen(true)}
        onOpenBlocked={() => openSubOverlay("blocked")}
        onSignOut={() => logout(setAuthToken, setFavourites)}
      />

      {subOverlay === "blocked" && (
        <BlockedOverlay
          subAnim={subAnim}
          onClose={closeSubOverlay}
          screenWidth={SCREEN_WIDTH}
        />
      )}

      {passwordPopupOpen && (
        <PasswordPopup onClose={() => setPasswordPopupOpen(false)} />
      )}
    </View>
  );
}

// app/profile/components/settings/SettingsOverlay.jsx
import React, { useState } from "react";
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
} from "../../../shared/imports";

import { logout } from "../../../shared/utils/logout";
import useFavouriteData from "../../hooks/useFavouriteData";

import BlockedOverlay from "./BlockedOverlay";
import PasswordPopup from "./PasswordPopup";
import SettingsSheet from "./SettingsSheet";
import { overlayStyles as styles } from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

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
  const { setFavourites } = useFavouriteData();

  const [activityOn, setActivityOn] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);

  const [subOverlay, setSubOverlay] = useState(null); // "blocked" | null
  const subAnim = useState(() => new Animated.Value(0))[0];

  const [signingOut, setSigningOut] = useState(false);

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
      const msg = err?.error || err?.message || "Failed to update profile. Please try again.";
      alert(msg);
    }
  };

  // ✅ logout now lives here
  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    try {
      // close local UI layers
      if (passwordPopupOpen) setPasswordPopupOpen(false);
      if (subOverlay) setSubOverlay(null);

      // clear UI cache immediately
      if (typeof setFavourites === "function") setFavourites([]);

      // clear auth + storage
      await setAuthToken(null);

      // navigate away
      router.replace("/LoginScreen");
    } catch (e) {
      console.log("LOGOUT FAILED:", e);
      router.replace("/LoginScreen");
    } finally {
      setTimeout(() => setSigningOut(false), 400);
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
        onSignOut={handleSignOut}
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

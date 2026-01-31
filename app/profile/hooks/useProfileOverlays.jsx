import { useRef, useState } from "react";
import { Animated } from "react-native";

export default function useProfileOverlays() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bioOverlayOpen, setBioOverlayOpen] = useState(false);
  const [emailOverlayOpen, setEmailOverlayOpen] = useState(false);

  const settingsAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;

  const openSettings = () => {
    setSettingsOpen(true);
    Animated.timing(settingsAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(settingsAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setSettingsOpen(false));
  };

  const openBioOverlay = () => {
    setBioOverlayOpen(true);
    Animated.timing(subAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeBioOverlay = () => {
    Animated.timing(subAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setBioOverlayOpen(false));
  };

  const openEmailOverlay = () => {
    setEmailOverlayOpen(true);
    Animated.timing(subAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeEmailOverlay = () => {
    Animated.timing(subAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setEmailOverlayOpen(false));
  };

  return {
    // state
    settingsOpen,
    bioOverlayOpen,
    emailOverlayOpen,

    // anims
    settingsAnim,
    subAnim,

    // actions
    openSettings,
    closeSettings,
    openBioOverlay,
    closeBioOverlay,
    openEmailOverlay,
    closeEmailOverlay,
  };
}

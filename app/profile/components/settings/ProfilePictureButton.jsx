// app/profile/components/settings/ProfilePictureButton.jsx
import React, { useMemo, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  COLORS,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "../../../shared/imports";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = 260;

export default function ProfilePictureButton({
  uri,
  onUpdate, // async (uri) => void
  onRemove, // async () => void
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const anim = useRef(new Animated.Value(0)).current;

  const hasImage = !!uri;

  const sheetTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_H + 40, 0],
    extrapolate: "clamp",
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
    extrapolate: "clamp",
  });

  const openSheet = () => {
    if (busy) return;
    setOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  const closeSheet = () => {
    Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(
      ({ finished }) => finished && setOpen(false)
    );
  };

  const pickFromLibrary = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        alert("Please allow photo library access to choose a picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled) return;

      const pickedUri = result.assets?.[0]?.uri;
      if (!pickedUri) return;

      await onUpdate?.(pickedUri);
      closeSheet();
    } catch (e) {
      console.log("pickFromLibrary error:", e);
      alert("Could not select that photo.");
    } finally {
      setBusy(false);
    }
  };

  const takePhoto = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        alert("Please allow camera access to take a photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled) return;

      const pickedUri = result.assets?.[0]?.uri;
      if (!pickedUri) return;

      await onUpdate?.(pickedUri);
      closeSheet();
    } catch (e) {
      console.log("takePhoto error:", e);
      alert("Could not take that photo.");
    } finally {
      setBusy(false);
    }
  };

  const removeCurrent = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onRemove?.();
      closeSheet();
    } catch (e) {
      console.log("removeCurrent error:", e);
      alert("Could not remove your picture.");
    } finally {
      setBusy(false);
    }
  };

  const initials = useMemo(() => {
    // fallback avatar content: simple circle + "?"
    return "?";
  }, []);

  return (
    <View style={{ alignItems: "center", paddingTop: 18 }}>
      <TouchableOpacity activeOpacity={0.85} onPress={openSheet}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            backgroundColor: COLORS.card,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.line || COLORS.faint,
          }}
        >
          {hasImage ? (
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: COLORS.subtext, fontSize: 28, fontWeight: "900" }}>
              {initials}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} onPress={openSheet} style={{ marginTop: 10 }}>
        <Text style={{ color: COLORS.accent || COLORS.text, fontWeight: "800" }}>
          Edit picture
        </Text>
      </TouchableOpacity>

      {/* Bottom sheet overlay */}
      {open && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -18, // pull up slightly so it covers above content too
            bottom: -80,
            justifyContent: "flex-end",
          }}
          pointerEvents="box-none"
        >
          {/* Backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeSheet}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: "black",
                opacity: backdropOpacity,
              }}
            />
          </TouchableOpacity>

          {/* Sheet */}
          <Animated.View
            style={{
              transform: [{ translateY: sheetTranslateY }],
              backgroundColor: COLORS.screen,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              paddingTop: 10,
              paddingBottom: 18,
              paddingHorizontal: 16,
              borderTopWidth: 1,
              borderColor: COLORS.line || COLORS.faint,
              minHeight: SHEET_H,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 44,
                height: 5,
                borderRadius: 999,
                backgroundColor: COLORS.faint,
                marginBottom: 12,
              }}
            />

            <SheetButton label="Choose from library" onPress={pickFromLibrary} disabled={busy} />
            <SheetButton label="Take a photo" onPress={takePhoto} disabled={busy} />
            <SheetButton
              label="Remove current picture"
              onPress={removeCurrent}
              disabled={busy || !hasImage}
              danger
            />

            <View style={{ height: 10 }} />

            <SheetButton label="Cancel" onPress={closeSheet} disabled={busy} subtle />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

function SheetButton({ label, onPress, disabled, danger, subtle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        backgroundColor: subtle ? "transparent" : COLORS.card,
        borderWidth: subtle ? 0 : 1,
        borderColor: COLORS.line || COLORS.faint,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          fontWeight: "800",
          color: danger ? COLORS.danger : subtle ? COLORS.subtext : COLORS.text,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

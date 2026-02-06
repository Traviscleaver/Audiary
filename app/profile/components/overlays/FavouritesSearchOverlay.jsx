import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { COLORS, Feather } from "../../../shared/imports";

export default function FavouritesSearchOverlay({ open, onClose, title }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: open ? 220 : 180,
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  if (!open) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 9999,
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />

      <Animated.View
        style={{
          transform: [{ translateY }],
          backgroundColor: COLORS.card,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "900" }}>
            {title || "Search"}
          </Text>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <Feather name="x" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: COLORS.subtext, lineHeight: 18 }}>
          Placeholder overlay. Later we’ll put your search UI here.
        </Text>

        <View style={{ height: 260 }} />
      </Animated.View>
    </View>
  );
}

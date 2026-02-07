import { useEffect, useRef } from "react";
import {
    Animated,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, Feather } from "../../../shared/imports";

/**
 * ProfileSectionsOverlay
 *
 * Shows toggles to show/hide profile sections.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - hidden: { album: boolean, song: boolean, artist: boolean }
 * - setHidden: (key: "album"|"song"|"artist", nextHidden: boolean) => void
 *
 * Note:
 * hidden=true means the section is hidden.
 * Switch=true means "show" (so it's inverted).
 */
export default function ProfileSectionsOverlay({ open, onClose, hidden, setHidden }) {
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

  const Row = ({ label, k }) => {
    const isHidden = !!hidden?.[k];
    const isShown = !isHidden;

    return (
      <View
        style={{
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.divider,
        }}
      >
        <Text style={{ color: COLORS.text, fontWeight: "800" }}>{label}</Text>

        <Switch
          value={isShown}
          onValueChange={(nextShown) => {
            // store as hidden
            setHidden?.(k, !nextShown);
          }}
        />
      </View>
    );
  };

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
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "900" }}>
            Customize profile
          </Text>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <Feather name="x" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: COLORS.subtext, marginBottom: 10 }}>
          Choose which sections appear on your profile.
        </Text>

        {/* Toggles */}
        <Row label="Favourite Albums" k="album" />
        <Row label="Favourite Songs" k="song" />
        <Row label="Favourite Artists" k="artist" />

        <View style={{ height: 8 }} />
      </Animated.View>
    </View>
  );
}

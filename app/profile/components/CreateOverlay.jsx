// app/profile/components/CreateOverlay.jsx
import { Animated, Pressable } from "react-native";
import {
  COLORS,
  Feather,
  Text,
  TouchableOpacity,
  View,
  useSafeAreaInsets,
} from "../../shared/imports";


export default function CreateOverlay({ anim, onClose, onPick }) {
  const insets = useSafeAreaInsets();

  // Slide up from bottom
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [340, 0],
  });

  // Fade backdrop
  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
      pointerEvents="box-none"
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000",
          opacity: backdropOpacity,
        }}
      />
      <Pressable
        onPress={onClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY }],
          backgroundColor: COLORS.screen,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingBottom: insets.bottom + 14,
          overflow: "hidden",
        }}
      >
        {/* Grabber */}
        <View
          style={{
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 6,
          }}
        >
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 999,
              backgroundColor: COLORS.divider,
              opacity: 0.9,
            }}
          />
        </View>

        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: COLORS.divider,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "800" }}>
            Create
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.card,
            }}
          >
            <Feather name="x" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <OptionRow
          label="List"
          icon="list"
          onPress={() => onPick?.("List")}
        />
        <OptionRow
          label="Review"
          icon="edit-3"
          onPress={() => onPick?.("Review")}
        />
        <OptionRow
          label="Section (Rich People Only)"
          icon="lock"
          onPress={() => onPick?.("Section")}
        />
      </Animated.View>
    </View>
  );
}

function OptionRow({ label, icon, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.divider,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: COLORS.card,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={18} color={COLORS.text} />
      </View>

      <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

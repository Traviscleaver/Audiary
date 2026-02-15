// app/shared/components/search/overlays/DetailHeader.jsx
import {
  COLORS,
  Feather,
  SIZES,
  Text,
  TouchableOpacity,
  useSafeAreaInsets,
  View,
} from "../../../imports";

export default function DetailHeader({ onBack, title = "", backgroundColor }) {
  const insets = useSafeAreaInsets();
  const bg = backgroundColor || COLORS.screen;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,

        // ✅ covers notch + navbar height
        height: insets.top + SIZES.navHeight,

        // ✅ same color as overlay background (and covers notch)
        backgroundColor: bg,

        zIndex: 9999,
      }}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{
          position: "absolute",
          left: 12,
          top: insets.top + 6,
          height: 34,
          width: 34,
          borderRadius: 17,
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={20} color={COLORS.text} />
      </TouchableOpacity>

      {/* ✅ Center title */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: insets.top,
          height: SIZES.navHeight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.text,
            fontWeight: "800",
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

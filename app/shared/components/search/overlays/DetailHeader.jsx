// app/shared/components/search/overlays/DetailHeader.jsx
import {
  COLORS,
  Feather,
  SIZES,
  TouchableOpacity,
  useSafeAreaInsets,
  View,
} from "../../../imports";

export default function DetailHeader({ onBack }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: insets.top + SIZES.navHeight,
        backgroundColor: "transparent",
        zIndex: 9999,
      }}
      pointerEvents="box-none"
    >
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
      >
        <Feather name="arrow-left" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

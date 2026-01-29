// DetailHeader.jsx
// Top header bar used inside the detail overlay screen.
// Shows a back button and a centered title, respecting safe area inset.

import {
  COLORS,
  Feather,
  SIZES,
  Text,
  TouchableOpacity,
  useSafeAreaInsets,
  View,
} from "../../imports";

export default function DetailHeader({ title, onBack }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: COLORS.navbar }}>
      <View
        style={{
          paddingTop: insets.top,
          height: SIZES.navHeight + insets.top,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          borderBottomColor: COLORS.divider,
          borderBottomWidth: 1,
        }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{
            position: "absolute",
            left: 10,
            top: insets.top + (SIZES.navHeight - 24) / 2,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {/* TITLE */}
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.text,
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

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

export default function DetailHeader({ title, onBack }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: COLORS.screen }}>
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

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
};

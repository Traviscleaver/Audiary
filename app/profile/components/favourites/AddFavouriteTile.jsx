import { TouchableOpacity, View } from "react-native";
import { COLORS, Feather, SIZES } from "../../../shared/imports";

/**
 * A bordered + tile the same size as cover art.
 */
export default function AddFavouriteTile({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width: SIZES.cover+10 }}
    >
      <View
        style={{
          width: SIZES.cover+10,
          height: SIZES.cover+10,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: COLORS.divider,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <Feather name="plus" size={26} color={COLORS.subtext} />
      </View>
    </TouchableOpacity>
  );
}

import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS, Feather, SIZES } from "../../../shared/imports";

/**
 * EditFavouriteTile
 * - Same cover size as favourites
 * - No subtitle
 * - Small red X in top-right to remove
 */
export default function EditFavouriteTile({ item, onPress, onRemove }) {
  const title = item?.title || "Untitled";
  const imageUrl = item?.image_url || "https://placehold.co/200x200";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ width: SIZES.cover }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: SIZES.cover,
            height: SIZES.cover,
            borderRadius: 10,
            backgroundColor: COLORS.card,
          }}
        />

        {/* ✅ small red X */}
        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.85}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#ff3b30", // iOS red
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="x" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text
        numberOfLines={1}
        style={{
          color: COLORS.text,
          marginTop: 6,
          fontWeight: "700",
          width: SIZES.cover,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

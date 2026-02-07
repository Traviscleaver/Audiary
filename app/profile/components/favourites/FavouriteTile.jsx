import { Image, Text, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../../../shared/imports";

/**
 * Favourite tile: cover + title + optional subtitle
 * item: { item_type, item_id, added_at, title, image_url, subtitle }
 */
export default function FavouriteTile({ item, onPress }) {
  const title = item?.title || "Untitled";
  const imageUrl = item?.image_url || "https://placehold.co/200x200";
  const subtitle = item?.subtitle || null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width: SIZES.cover+10 }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: SIZES.cover+10,
          height: SIZES.cover+10,
          borderRadius: 10,
          backgroundColor: COLORS.card,
        }}
      />

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

      {!!subtitle && (
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.subtext,
            marginTop: 2,
            fontSize: 12,
            width: SIZES.cover,
          }}
        >
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
}

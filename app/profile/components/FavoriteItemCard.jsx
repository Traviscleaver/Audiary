import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../../shared/imports";

/**
 * Hydrated favorite item:
 * item = {
 *   item_type, item_id, added_at,
 *   title, image_url, subtitle
 * }
 */
export default function FavoriteItemCard({ item }) {
  const title = item?.title || "Untitled";
  const imageUrl = item?.image_url || "https://placehold.co/200x200";
  const subtitle = item?.subtitle || null;

  if (!item) {
    return (
      <View
        style={{
          width: SIZES.cover,
          height: SIZES.cover,
          backgroundColor: COLORS.card,
          borderRadius: 8,
          marginRight: 12,
        }}
      />
    );
  }

  return (
    <TouchableOpacity style={{ marginRight: 12 }}>
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: SIZES.cover,
          height: SIZES.cover,
          borderRadius: 8,
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

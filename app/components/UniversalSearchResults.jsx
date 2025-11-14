// components/UniversalSectionList.jsx
import { Feather } from "@expo/vector-icons";
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, SIZES } from "../lib/imports";

/**
 * Universal Section List
 *
 * Props:
 * - title: string
 * - data: array of items
 * - type: "Albums" | "Tracks" | "Artists"
 * - onOpen: (item, type) => void
 * - onViewAll: (type) => void
 */
export default function UniversalSectionList({
  title,
  data,
  type,
  onOpen,
  onViewAll,
}) {
  if (!data?.length) return null;

  const Row = ({ item }) => {
    const img =
      item.coverUrl ||
      item.imageUrl ||
      item.albumCover ||
      item.artistImage ||
      null;

    return (
      <TouchableOpacity
        onPress={() => onOpen(item, type)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.divider,
        }}
      >
        {img ? (
          <Image
            source={{ uri: img }}
            style={{
              width: SIZES.image,
              height: SIZES.image,
              borderRadius: type === "Artists" ? SIZES.image / 2 : 10,
              marginRight: 14,
              backgroundColor: COLORS.field,
            }}
          />
        ) : (
          <View
            style={{
              width: SIZES.image,
              height: SIZES.image,
              borderRadius: type === "Artists" ? SIZES.image / 2 : 10,
              marginRight: 14,
              backgroundColor: COLORS.field,
            }}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: COLORS.text,
            }}
          >
            {item.title || item.name}
          </Text>

          {item.artist ? (
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, color: COLORS.subtext, marginTop: 2 }}
            >
              {item.artist}
            </Text>
          ) : null}
        </View>

        <Feather name="chevron-right" size={22} color={COLORS.subtext} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "800",
          color: COLORS.text,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <FlatList
        data={data}
        scrollEnabled={false}
        renderItem={({ item }) => <Row item={item} />}
        keyExtractor={(i) => String(i.id)}
      />

      <TouchableOpacity
        onPress={() => onViewAll(type)}
        style={{ marginTop: 10 }}
      >
        <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
          View all {title.toLowerCase()}...
        </Text>
      </TouchableOpacity>
    </View>
  );
}

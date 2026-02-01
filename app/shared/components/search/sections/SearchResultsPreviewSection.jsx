import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../imports";
import SearchResultRow from "../rows/SearchResultRow";

export default function SearchResultsPreviewSection({
  title,
  data,
  type,       // must be: "Albums" | "Tracks" | "Artists"
  onOpen,
  onViewAll,
}) {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: COLORS.text,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <SearchResultRow
            item={item}
            isArtist={type === "Artists"}
            onPress={() => onOpen(item, type)}
          />
        )}
      />

      <TouchableOpacity
        onPress={() => onViewAll(type)}
        activeOpacity={0.8}
        style={{ marginTop: 10 }}
      >
        <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
          View all {title.toLowerCase()}...
        </Text>
      </TouchableOpacity>
    </View>
  );
}

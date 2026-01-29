// SearchResultsPreviewSection.jsx
// Small titled section used on the search/home screen to preview results (albums/tracks/artists).
// Renders a short list of rows plus a "View all..." action.

import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../imports";
import SearchResultRow from "./SearchResultRow";

export default function SearchResultsPreviewSection({
  title,
  data,
  type,
  onOpen,
  onViewAll,
}) {
  if (!data || data.length === 0) return null;

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
        renderItem={({ item }) => (
          <SearchResultRow
            item={item}
            isArtist={type === "Artists"}
            onPress={() => onOpen(item, type)}
          />
        )}
        scrollEnabled={false}
      />

      <TouchableOpacity onPress={() => onViewAll(type)} style={{ marginTop: 10 }}>
        <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
          View all {title.toLowerCase()}...
        </Text>
      </TouchableOpacity>
    </View>
  );
}

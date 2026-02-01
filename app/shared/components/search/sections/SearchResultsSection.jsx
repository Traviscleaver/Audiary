// app/shared/components/search/sections/SearchResultsSection.jsx
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../imports";
import SearchResultRow from "../rows/SearchResultRow";

export default function SearchResultsSection({
  title,
  data,
  type,
  onOpen,
  onViewAll,
}) {
  if (!data?.length) return null;

  const variant = type === "Artists" ? "artist" : "default";

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={data}
        scrollEnabled={false}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <SearchResultRow
            item={item}
            variant={variant}
            onPress={() => onOpen(item, type)}
          />
        )}
      />

      <TouchableOpacity onPress={() => onViewAll(type)} style={styles.viewAllBtn}>
        <Text style={styles.viewAllText}>View all {title.toLowerCase()}...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  section: {
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  viewAllBtn: {
    marginTop: 10,
  },
  viewAllText: {
    color: COLORS.subtext,
    fontSize: 14,
  },
};

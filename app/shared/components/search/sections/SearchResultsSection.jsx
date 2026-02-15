// app/shared/components/search/sections/SearchResultsSection.jsx
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
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

  const handleViewAll = () => {
    if (typeof onViewAll !== "function") {
      Alert.alert(
        "View all not wired",
        "onViewAll is missing in the parent search screen. Pass onViewAll(type) into this section."
      );
      return;
    }
    onViewAll(type);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={data}
        scrollEnabled={false}
        keyExtractor={(i, idx) => String(i?.id ?? i?.spotifyId ?? idx)}
        renderItem={({ item }) => (
          <SearchResultRow
            item={item}
            variant={variant}
            onPress={() => onOpen(item, type)}
          />
        )}
      />

      <TouchableOpacity onPress={handleViewAll} style={styles.viewAllBtn}>
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

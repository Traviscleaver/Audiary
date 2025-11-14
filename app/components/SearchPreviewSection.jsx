// components/SectionList.jsx
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../theme";
import RowItem from "./SearchResultRow";

export default function SectionList({ title, data, type, onOpen, onViewAll }) {
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
          <RowItem
            item={item}
            isArtist={type === "Artists"}
            onPress={() => onOpen(item, type)} // FIXED
          />
        )}
        scrollEnabled={false}
      />

      {/* VIEW ALL BUTTON */}
      <TouchableOpacity
        onPress={() => onViewAll(type)} // FIXED
        style={{ marginTop: 10 }}
      >
        <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
          View all {title.toLowerCase()}...
        </Text>
      </TouchableOpacity>
    </View>
  );
}

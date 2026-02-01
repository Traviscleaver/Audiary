// app/shared/components/search/sections/SearchResultsPreviewSection.jsx
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../imports";
import SearchResultRow from "../rows/SearchResultRow";

export default function SearchResultsPreviewSection({
  title,
  data,
  type, // "Albums" | "Tracks" | "Artists" | "Users"
  onOpen,
  onViewAll,
}) {
  if (!Array.isArray(data) || data.length === 0) return null;

  // ✅ USERS PREVIEW (NEW)
  if (type === "Users") {
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
          scrollEnabled={false}
          keyExtractor={(u) => String(u.user_id || u.username)}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onOpen(item, "Users")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Image
                source={
                  item.avatar_url
                    ? { uri: item.avatar_url }
                    : { uri: "https://via.placeholder.com/80" }
                }
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  marginRight: 12,
                  backgroundColor: COLORS.divider,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "700" }}>
                  {item.username}
                </Text>

                {!!item.display_name && (
                  <Text style={{ color: COLORS.subtext, marginTop: 2 }}>
                    {item.display_name}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          onPress={() => onViewAll("Users")}
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

  // ✅ EXISTING BEHAVIOR (Albums/Tracks/Artists)
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

// SearchResultRow.jsx
// Single row item displayed in the search results list (album/artist/track).
// Shows thumbnail, title/subtitle, explicit badge, and chevron. Calls onPress when tapped.

import {
  COLORS,
  Feather,
  Image,
  SIZES,
  Text,
  TouchableOpacity,
  View,
} from "../../imports";

export default function SearchResultRow({ item, isArtist, onPress }) {
  const img =
    item.coverUrl ||
    item.imageUrl ||
    item.albumCover ||
    item.artistImage ||
    null;

  return (
  

    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.7}>
      {/* IMAGE / PLACEHOLDER */}
      {img ? (
        <Image
          source={{ uri: img }}
          style={{
            width: SIZES.image,
            height: SIZES.image,
            borderRadius: isArtist ? SIZES.image / 2 : 8,
            marginRight: 14,
            backgroundColor: COLORS.field,
          }}
        />
      ) : (
        <View
          style={{
            width: SIZES.image,
            height: SIZES.image,
            borderRadius: isArtist ? SIZES.image / 2 : 8,
            marginRight: 14,
            backgroundColor: COLORS.field,
          }}
        />
      )}

      {/* TEXT */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
          {item.explicit ? (
            <View style={styles.explicitBadge}>
              <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 12 }}>
                E
              </Text>
            </View>
          ) : null}

          <Text numberOfLines={1} style={styles.title}>
            {item.title || item.name}
          </Text>
        </View>

        {item.artist && (
          <Text numberOfLines={1} style={styles.sub}>
            {item.artist}
          </Text>
        )}
      </View>

      {/* RIGHT CHEVRON */}
      <Feather name="chevron-right" size={22} color={COLORS.subtext} />
    </TouchableOpacity>
  );
}

const styles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.rowPaddingY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  explicitBadge: {
    backgroundColor: COLORS.field,
    borderColor: COLORS.divider,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  title: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: SIZES.rowTitle,
  },
  sub: {
    color: COLORS.subtext,
    fontSize: SIZES.rowSub,
  },
};

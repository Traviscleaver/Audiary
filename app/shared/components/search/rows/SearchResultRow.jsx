// app/shared/components/search/rows/SearchResultRow.jsx
import {
  COLORS,
  Feather,
  Image,
  SIZES,
  Text,
  TouchableOpacity,
  View,
} from "../../../imports";

export default function SearchResultRow({ item, variant = "default", onPress }) {
  const img =
    item.coverUrl ||
    item.imageUrl ||
    item.albumCover ||
    item.artistImage ||
    null;

  const isArtist = variant === "artist";

  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.7}>
      {/* artwork */}
      {img ? (
        <Image
          source={{ uri: img }}
          style={[
            styles.image,
            { borderRadius: isArtist ? SIZES.image / 2 : 8 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.image,
            { borderRadius: isArtist ? SIZES.image / 2 : 8 },
          ]}
        />
      )}

      {/* text */}
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          {item.explicit ? (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          ) : null}

          <Text numberOfLines={1} style={styles.title}>
            {item.title || item.name}
          </Text>
        </View>

        {item.artist ? (
          <Text numberOfLines={1} style={styles.sub}>
            {item.artist}
          </Text>
        ) : null}
      </View>

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
  image: {
    width: SIZES.image,
    height: SIZES.image,
    marginRight: 14,
    backgroundColor: COLORS.field,
  },
  textWrap: {
    flex: 1,
    paddingRight: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  explicitText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 12,
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

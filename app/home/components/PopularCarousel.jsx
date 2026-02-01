import {
  ActivityIndicator,
  COLORS,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/imports";
import { ALBUMS_TAB, TRACKS_TAB } from "../libs/constants";
import { getPopularSectionState } from "../styles/selectors";
import { styles } from "../styles/styles";

export default function PopularCarousel({
  tab,
  setTab,
  popularAlbums,
  tracks,
  loadingAlbums,
  loadingTracks,
  onOpenDetail, // ✅ new
}) {
  const { items, loading } = getPopularSectionState({
    tab,
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
  });

  const detailType = tab === ALBUMS_TAB ? "Albums" : "Tracks";

  return (
    <>
      {/* Popular Section Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Top of the charts</Text>

        <View style={styles.sectionTabsRow}>
          <TouchableOpacity onPress={() => setTab(ALBUMS_TAB)}>
            <Text
              style={[
                styles.sectionTabLabel,
                tab === ALBUMS_TAB && styles.sectionTabLabelActive,
              ]}
            >
              ALBUMS
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTabSlash}> / </Text>

          <TouchableOpacity onPress={() => setTab(TRACKS_TAB)}>
            <Text
              style={[
                styles.sectionTabLabel,
                tab === TRACKS_TAB && styles.sectionTabLabelActive,
              ]}
            >
              TRACKS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : !items?.length ? (
        <Text style={styles.emptyText}>No data to display.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          numColumns={3}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.popularGridContent}
          columnWrapperStyle={styles.popularGridRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.popularGridItem}
              onPress={() => onOpenDetail?.(detailType, item)} // ✅ open overlay
            >
              <View style={styles.popularGridCoverWrap}>
                {item.coverUrl ? (
                  <Image
                    source={{ uri: item.coverUrl }}
                    style={styles.popularGridImage}
                  />
                ) : (
                  <View style={styles.albumPlaceholder}>
                    <Text style={styles.albumPlaceholderText}>
                      {item.title?.slice(0, 2)?.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

                {!!item.rank && (
                  <View style={styles.rankBubble}>
                    <Text style={[styles.rankText, { color: COLORS.text }]}>
                      {item.rank}
                    </Text>
                  </View>
                )}

              <Text style={styles.popularGridTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.popularGridArtist} numberOfLines={1}>
                {item.artist}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
}








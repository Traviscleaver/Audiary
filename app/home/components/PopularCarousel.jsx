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
}) {
  const { items, loading } = getPopularSectionState({
    tab,
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
  });


  return (
    <>
      {/* Popular Section Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Popular This Week</Text>

        <View style={styles.sectionTabsRow}>
          <TouchableOpacity onPress={() => setTab(ALBUMS_TAB)}>
            <Text style={[styles.sectionTabLabel, tab === ALBUMS_TAB && styles.sectionTabLabelActive]}>
              ALBUMS
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTabSlash}> / </Text>

          <TouchableOpacity onPress={() => setTab(TRACKS_TAB)}>
            <Text style={[styles.sectionTabLabel, tab === TRACKS_TAB && styles.sectionTabLabelActive]}>
              TRACKS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : !items?.length ? (
        <Text style={styles.emptyText}>No data to display.</Text>
      ) : (
        <FlatList
          data={items}
          horizontal
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item }) => (
            <View style={styles.albumCard}>
              <View style={styles.albumCoverWrap}>
                {item.coverUrl ? (
                  <Image source={{ uri: item.coverUrl }} style={styles.albumImage} />
                ) : (
                  <View style={styles.albumPlaceholder}>
                    <Text style={styles.albumPlaceholderText}>
                      {item.title?.slice(0, 2)?.toUpperCase()}
                    </Text>
                  </View>
                )}

                {item.rank && (
                  <View style={styles.rankBubble}>
                    <Text
                      style={[
                        styles.rankText,
                        {
                          color:
                            item.rank === 1
                              ? COLORS.text
                              : item.rank === 2
                              ? COLORS.text
                              : item.rank === 3
                              ? COLORS.text
                              : COLORS.text,
                        },
                      ]}
                    >
                      {item.rank}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.albumTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.albumArtist} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
          )}
        />
      )}
    </>
  );
}

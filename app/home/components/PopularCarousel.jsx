// app/home/components/PopularCarousel.jsx
import { useWindowDimensions } from "react-native";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/imports";

import { ALBUMS_TAB, TRACKS_TAB } from "../libs/constants";
import { getPopularSectionState } from "../styles/selectors";
import { styles } from "../styles/styles";

function getColumns(width) {
  if (width >= 1024) return 5;
  if (width >= 820) return 4;
  return 3;
}

export default function PopularCarousel({
  tab,
  setTab,
  popularAlbums,
  tracks,
  loadingAlbums,
  loadingTracks,
  onOpenDetail,
  ensureTracksLoaded,
}) {
  const { width } = useWindowDimensions();
  const numColumns = getColumns(width);

  const { items, loading } = getPopularSectionState({
    tab,
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
  });

  const detailType = tab === ALBUMS_TAB ? "Albums" : "Tracks";

  const GRID_HORIZONTAL_PADDING = 16;
  const TILE_GAP = 12;

  const available =
    width - GRID_HORIZONTAL_PADDING * 2 - TILE_GAP * (numColumns - 1);

  const tileWidth = Math.floor(available / numColumns);
  const tileStyle = { width: tileWidth };
  const coverSquareStyle = { width: tileWidth, height: tileWidth };

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

          <TouchableOpacity
            onPress={() => {
              ensureTracksLoaded?.(); // ✅ fetch tracks only when pressed
              setTab(TRACKS_TAB);
            }}
          >
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
          // ✅ FIX: reset list on tab + column change (prevents key collisions)
          key={`${tab}-${numColumns}`}
          data={items}
          // ✅ FIX: guaranteed-unique keys even if id missing/duplicated
          keyExtractor={(item, index) =>
            `${tab}-${item?.id ?? `idx-${index}`}`
          }
          numColumns={numColumns}
          scrollEnabled={false} // ✅ keep false to avoid nested VirtualizedList warning
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.popularGridContent}
          columnWrapperStyle={[
            styles.popularGridRow,
            { gap: TILE_GAP, justifyContent: "flex-start" },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.popularGridItem, tileStyle]}
              onPress={() => onOpenDetail?.(detailType, item)}
            >
              <View style={[styles.popularGridCoverWrap, coverSquareStyle]}>
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

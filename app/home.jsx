// app/home.jsx
import {
  ActivityIndicator,
  Animated,
  COLORS,
  Dimensions,
  Feather,
  FlatList,
  Image,
  SIZES,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useRouter,
  useSafeAreaInsets,
  useState
} from "./lib/imports";

/* Components */
import FooterBar from "./components/MainNavigationFooter";
import HeaderBar from "./components/OverlayHeaderBar";
import SectionList from "./components/SearchPreviewSection";
import DetailBody from "./components/SearchResultDetailContent";
import RowItem from "./components/SearchResultRow";
import SubDetailView from "./components/SubResultDetailOverlay";

/* Hooks */
import usePopularSection from "./hooks/useHomePopularSection";
import useSearchHome from "./hooks/useHomeSearchController";
import useDetail from "./hooks/userDetailOverlayController";
import useOverlay from "./hooks/useViewAllOverlayController";

const SCREEN_WIDTH = Dimensions.get("window").width;

/* Tabs */
const ALBUMS_TAB = "ALBUMS";
const TRACKS_TAB = "TRACKS";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* 🔥 POPULAR ALBUMS + TRACKS */
  const {
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
  } = usePopularSection();

  /* 🔥 SEARCH system */
  const {
    searchOpen,
    query,
    albums,
    artists,
    tracksRes,
    searchAnim,
    searchInputRef,
    loadingSearch,

    openSearchOverlay,
    closeSearchOverlay,
    panResponderSearch,
    setQuery,
  } = useSearchHome();

  /* 🔥 OVERLAY system (View All) */
  const {
    overlayType,
    overlayData,
    overlayLoading,
    overlayAnim,
    overlayQuery,
    openOverlay,
    closeOverlay,
    panResponderOverlay,
  } = useOverlay();

  /* 🔥 DETAIL + SUBDETAIL system */
  const {
    detailOpen,
    detailItem,
    detailType,
    detailAnim,
    detailScrollRef,
    detailScrollYRef,
    albumTracks,
    detailLoading,
    showAllAlbumTracks,

    openDetail,
    closeDetail,

    subDetailOpen,
    subDetailItem,
    subDetailType,
    subDetailAnim,
    subDetailScrollRef,

    openSubDetail,
    closeSubDetail,
    panResponderDetail,
    panResponderSubDetail,
    setShowAllAlbumTracks,
  } = useDetail();

  /* 🔥 MAIN PAGE TABS */
  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* FULL NOTCH BACKGROUND */}
      <View
        style={{
          height: insets.top,
          backgroundColor: COLORS.navbar,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      />

      {/* NAVBAR */}
      <View style={[styles.header, { paddingTop: insets.top + 8, zIndex: 1000 }]}>
        <Text style={styles.appTitle}>Audiary</Text>

        {/* SEARCH BAR */}
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
          <View style={[styles.searchBarContainer, { flex: 1 }]}>
            <Feather
              name="search"
              size={18}
              color={COLORS.subtext}
              style={{ marginRight: 6 }}
            />

            <TextInput
              ref={searchInputRef}
              placeholder="What have you been listening to?"
              placeholderTextColor={COLORS.subtext}
              value={query}
              onFocus={() => {
                if (!searchOpen) openSearchOverlay();
              }}
              onChangeText={setQuery}
              style={styles.searchInput}
            />

            {searchOpen && query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {searchOpen && (
            <TouchableOpacity onPress={closeSearchOverlay} style={{ paddingLeft: 10 }}>
              <Text style={{ color: COLORS.subtext, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={[styles.scroll, { paddingTop: 10 }]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Popular Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>

          <View style={styles.sectionTabsRow}>
            <TouchableOpacity onPress={() => setAlbumsTracksTab(ALBUMS_TAB)}>
              <Text
                style={[
                  styles.sectionTabLabel,
                  albumsTracksTab === ALBUMS_TAB && styles.sectionTabLabelActive,
                ]}
              >
                ALBUMS
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTabSlash}> / </Text>

            <TouchableOpacity onPress={() => setAlbumsTracksTab(TRACKS_TAB)}>
              <Text
                style={[
                  styles.sectionTabLabel,
                  albumsTracksTab === TRACKS_TAB && styles.sectionTabLabelActive,
                ]}
              >
                TRACKS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Carousel */}
        {(() => {
          const isAlbums = albumsTracksTab === ALBUMS_TAB;
          const items = isAlbums ? popularAlbums : tracks;
          const loading = isAlbums ? loadingAlbums : loadingTracks;

          if (loading)
            return (
              <View style={styles.loaderWrap}>
                <ActivityIndicator size="large" />
              </View>
            );

          if (!items.length)
            return <Text style={styles.emptyText}>No data to display.</Text>;

          return (
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
                                  ? COLORS.gold
                                  : item.rank === 2
                                  ? COLORS.silver
                                  : item.rank === 3
                                  ? COLORS.bronze
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
          );
        })()}

        {/* Timeline Header */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.sectionTabsRow}>
            <Text style={[styles.sectionTabLabel, styles.sectionTabLabelActive]}>TRENDING</Text>
            <Text style={styles.sectionTabSlash}> / </Text>
            <Text style={styles.sectionTabLabel}>FRIENDS</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* FOOTER */}
      <FooterBar router={router} insets={insets} />

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <Animated.View
          {...panResponderSearch.panHandlers}
          style={[
            styles.searchOverlay,
            { transform: [{ translateX: searchAnim }], paddingTop: insets.top + 120 },
          ]}
        >
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            {loadingSearch ? (
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : (
              <>
                <SectionList
                title="Albums"
                data={albums}
                type="Albums"
                onOpen={openDetail}
                onViewAll={(type) => {
                  closeSearchOverlay();      // ⭐ hide the search bar overlay
                  openOverlay(type, query);  // ⭐ open the View All overlay
                }}

              />

              <SectionList
                title="Tracks"
                data={tracksRes}
                type="Tracks"
                onOpen={openDetail}
                onViewAll={(type) => {
                  closeSearchOverlay();      // ⭐ hide the search bar overlay
                  openOverlay(type, query);  // ⭐ open the View All overlay
                }}

              />

              <SectionList
                title="Artists"
                data={artists}
                type="Artists"
                onOpen={openDetail}
                onViewAll={(type) => {
                  closeSearchOverlay();      // ⭐ hide the search bar overlay
                  openOverlay(type, query);  // ⭐ open the View All overlay
                }}

              />
              </>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* OVERLAY — VIEW ALL */}
      {overlayType && (
        <Animated.View
          {...panResponderOverlay.panHandlers}
          style={[
            styles.fullOverlay,
            { transform: [{ translateX: overlayAnim }], backgroundColor: COLORS.screen },
          ]}
        >
          <HeaderBar title={`"${overlayQuery}" in ${overlayType}`} onBack={closeOverlay} />



          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: SIZES.footerHeight + insets.bottom + 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {overlayLoading ? (
              <View style={styles.centerLoader}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : (
              <FlatList
                data={overlayData}
                scrollEnabled={false}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                  <RowItem
                    item={item}
                    isArtist={overlayType === "Artists"}
                    onPress={() => openDetail(item, overlayType)}
                  />
                )}
              />
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* DETAIL VIEW */}
      {detailOpen && (
        <Animated.View
          {...panResponderDetail.panHandlers}
          style={[
            styles.fullOverlay,
            {
              backgroundColor: COLORS.screen,
              transform: [{ translateX: detailAnim }],
              zIndex: 1000,
            },
          ]}
        >
          <HeaderBar
            title={
              detailType === "Tracks"
                ? "Track"
                : detailType === "Albums"
                ? "Album"
                : "Artist"
            }
            onBack={closeDetail}
          />

          <DetailBody
            type={detailType}
            item={detailItem}
            loading={detailLoading}
            tracks={albumTracks}
            showAll={showAllAlbumTracks}
            setShowAll={setShowAllAlbumTracks}
            scrollRef={detailScrollRef}
            scrollYRef={detailScrollYRef}
            openSubDetail={openSubDetail}
          />
        </Animated.View>
      )}

      {/* SUB DETAIL */}
      {subDetailOpen && (
        <SubDetailView
          subDetailAnim={subDetailAnim}
          panResponderSubDetail={panResponderSubDetail}
          subDetailType={subDetailType}
          subDetailItem={subDetailItem}
          closeSubDetail={closeSubDetail}
          subDetailScrollRef={subDetailScrollRef}
          insets={insets}
        />
      )}
    </View>
  );
}

/* ===== STYLES (IDENTICAL TO ORIGINAL) ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screen },

  header: {
    backgroundColor: COLORS.navbar,
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  appTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.screen,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    color: COLORS.text,
  },

  scroll: { flex: 1 },

  sectionHeaderRow: {
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: COLORS.text, fontSize: 20, fontWeight: "700" },

  sectionTabsRow: { flexDirection: "row", alignItems: "center" },
  sectionTabLabel: { color: COLORS.subtext, fontSize: 12, fontWeight: "600" },
  sectionTabLabelActive: { color: COLORS.active },
  sectionTabSlash: { color: COLORS.subtext, marginHorizontal: 4, fontSize: 12 },

  loaderWrap: { paddingVertical: 24 },
  emptyText: { color: COLORS.subtext, padding: 24, textAlign: "center" },

  carouselContent: { paddingHorizontal: 16, paddingTop: 12 },

  albumCard: { width: 130, marginRight: 14, alignItems: "center" },
  albumCoverWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    position: "relative",
  },
  albumImage: { width: "100%", height: "100%" },
  albumPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  albumPlaceholderText: { color: COLORS.subtext, fontSize: 14 },

  albumTitle: { color: COLORS.text, fontSize: 12, fontWeight: "600", marginTop: 6, textAlign: "center" },
  albumArtist: { color: COLORS.subtext, fontSize: 11, marginTop: 2, textAlign: "center" },

  rankBubble: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: COLORS.active,
  },
  rankText: { fontSize: 10, fontWeight: "700" },

  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 999,
  },

  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 9099,
  },

  centerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

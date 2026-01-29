import {
  ScrollView,
  StatusBar,
  Text,
  View,
  useRouter,
  useSafeAreaInsets,
  useState,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";

/* Hooks */
import useDetailOverlayController from "../shared/hooks/useDetailOverlayController";
import usePopularMusic from "../shared/hooks/usePopularMusic";
import useResultsOverlayController from "../shared/hooks/useResultsOverlayController";
import useSearchController from "../shared/hooks/useSearchController";

import { styles } from "./styles/styles";

/* Local UI blocks */
import DetailOverlay from "./components/DetailOverlay";
import HomeHeader from "./components/HomeHeader";
import PopularCarousel from "./components/PopularCarousel";
import SearchOverlay from "./components/SearchOverlay";
import SubDetailOverlay from "./components/SubDetailOverlay";
import ViewAllOverlay from "./components/ViewAllOverlay";
import { ALBUMS_TAB } from "./libs/constants";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* 🔥 POPULAR ALBUMS + TRACKS */
  const { popularAlbums, tracks, loadingAlbums, loadingTracks } = usePopularMusic();

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
  } = useSearchController();

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
  } = useResultsOverlayController();

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

    closeDetail,

    subDetailOpen,
    subDetailItem,
    subDetailType,
    subDetailAnim,
    subDetailScrollRef,

    openDetail,
    openSubDetail,
    closeSubDetail,
    panResponderDetail,
    panResponderSubDetail,
    setShowAllAlbumTracks,
  } = useDetailOverlayController();

  /* 🔥 MAIN PAGE TABS */
  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <HomeHeader
        insetsTop={insets.top}
        query={query}
        setQuery={setQuery}
        searchOpen={searchOpen}
        openSearchOverlay={openSearchOverlay}
        closeSearchOverlay={closeSearchOverlay}
        searchInputRef={searchInputRef}
      />

      {/* MAIN CONTENT */}
      <ScrollView
        style={[styles.scroll, { paddingTop: 10 }]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <PopularCarousel
          tab={albumsTracksTab}
          setTab={setAlbumsTracksTab}
          popularAlbums={popularAlbums}
          tracks={tracks}
          loadingAlbums={loadingAlbums}
          loadingTracks={loadingTracks}
        />

        {/* Timeline Header (kept inline for now) */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.sectionTabsRow}>
            <Text style={[styles.sectionTabLabel, styles.sectionTabLabelActive]}>
              TRENDING
            </Text>
            <Text style={styles.sectionTabSlash}> / </Text>
            <Text style={styles.sectionTabLabel}>FRIENDS</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* FOOTER */}
      <FooterBar router={router} insets={insets} />

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        searchOpen={searchOpen}
        insetsTop={insets.top}
        searchAnim={searchAnim}
        panResponderSearch={panResponderSearch}
        loadingSearch={loadingSearch}
        albums={albums}
        tracksRes={tracksRes}
        artists={artists}
        query={query}
        openDetail={openDetail}
        closeSearchOverlay={closeSearchOverlay}
        openOverlay={openOverlay}
      />

      {/* OVERLAY — VIEW ALL */}
      <ViewAllOverlay
        overlayType={overlayType}
        overlayData={overlayData}
        overlayLoading={overlayLoading}
        overlayAnim={overlayAnim}
        overlayQuery={overlayQuery}
        panResponderOverlay={panResponderOverlay}
        closeOverlay={closeOverlay}
        openDetail={openDetail}
        insetsBottom={insets.bottom}
      />

      {/* DETAIL VIEW */}
      <DetailOverlay
        detailOpen={detailOpen}
        detailItem={detailItem}
        detailType={detailType}
        detailAnim={detailAnim}
        detailScrollRef={detailScrollRef}
        detailScrollYRef={detailScrollYRef}
        albumTracks={albumTracks}
        detailLoading={detailLoading}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        closeDetail={closeDetail}
        openSubDetail={openSubDetail}
        panResponderDetail={panResponderDetail}
      />

      {/* SUB DETAIL */}
      <SubDetailOverlay
        subDetailOpen={subDetailOpen}
        subDetailAnim={subDetailAnim}
        panResponderSubDetail={panResponderSubDetail}
        subDetailType={subDetailType}
        subDetailItem={subDetailItem}
        closeSubDetail={closeSubDetail}
        subDetailScrollRef={subDetailScrollRef}
        insets={insets}
      />
    </View>
  );
}

import {
  COLORS,
  ScrollView,
  Text,
  View,
  useRouter,
  useSafeAreaInsets,
  useState,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";

/* Hooks (standardized under shared/hooks) */
import useDetailOverlayController from "../shared/hooks/useDetailOverlayController";
import useResultsOverlayController from "../shared/hooks/useResultsOverlayController";
import useSearchController from "../shared/hooks/useSearchController";

/* Local pieces */
import MusicResults from "./components/MusicResults";
import SearchHeader from "./components/SearchHeader";
import TopTabs from "./components/TopTabs";
import { styles } from "./styles/styles";

/* Reused overlays (renamed) */
import { default as DetailScreenOverlay, default as SearchResultsSectionOverlay } from "../shared/components/search/DetailScreenOverlay";
import NestedDetailOverlay from "../shared/components/search/NestedDetailOverlay";

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  const [activeTopTab, setActiveTopTab] = useState("Music");

  return (
    <View style={styles.screen}>
      <SearchHeader
        insetsTop={insets.top}
        query={query}
        setQuery={setQuery}
        searchOpen={searchOpen}
        openSearchOverlay={openSearchOverlay}
        closeSearchOverlay={closeSearchOverlay}
        searchInputRef={searchInputRef}
      />

      <TopTabs activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

      <ScrollView
        style={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeTopTab === "Music" ? (
          <MusicResults
            loadingSearch={loadingSearch}
            albums={albums}
            tracksRes={tracksRes}
            artists={artists}
            query={query}
            openDetail={openDetail}
            openOverlay={openOverlay}
          />
        ) : (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={{ color: COLORS.faint }}>
              No content for {activeTopTab} yet.
            </Text>
          </View>
        )}
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* Reused overlays */}
      <SearchResultsSectionOverlay
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

      <DetailScreenOverlay
        open={detailOpen}
        setOpen={(v) => (v ? null : closeDetail())}
        detailType={detailType}
        detailItem={detailItem}
        detailLoading={detailLoading}
        albumTracks={albumTracks}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={openSubDetail}
      />

      <NestedDetailOverlay
        open={subDetailOpen}
        setOpen={(v) => (v ? null : closeSubDetail())}
        detailType={subDetailType}
        detailItem={subDetailItem}
      />
    </View>
  );
}

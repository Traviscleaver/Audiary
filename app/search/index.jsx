// app/search/index.jsx
import {
  ScrollView,
  View,
  useRouter,
  useSafeAreaInsets,
  useState,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";

import useDetailOverlayController from "../shared/hooks/useDetailOverlayController";
import useResultsOverlayController from "../shared/hooks/useResultsOverlayController";
import useSearchController from "../shared/hooks/useSearchController";

import { styles } from "./styles/styles";
import SearchHeader from "./ui/SearchHeader";
import TabResults from "./ui/TabResults";
import TopTabs from "./ui/TopTabs";

import { default as DetailScreenOverlay, default as SearchResultsSectionOverlay } from "../shared/components/search/overlays/DetailScreenOverlay";
import NestedDetailOverlay from "../shared/components/search/overlays/NestedDetailOverlay";

import { getTabByKey } from "./tabs";

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTopTab, setActiveTopTab] = useState("Music");
  const activeTab = getTabByKey(activeTopTab);

  const {
    searchOpen,
    query,
    setQuery,
    data,
    searchInputRef,
    loadingSearch,
    openSearchOverlay,
    closeSearchOverlay,
  } = useSearchController({ tab: activeTab });

  const {
    overlayType,
    overlayData,
    overlayLoading,
    overlayAnim,
    overlayQuery,
    openOverlay,
    closeOverlay,
    panResponderOverlay,
  } = useResultsOverlayController({ tab: activeTab });

  const {
    detailOpen,
    detailItem,
    detailType,
    albumTracks,
    detailLoading,
    showAllAlbumTracks,
    closeDetail,

    subDetailOpen,
    subDetailItem,
    subDetailType,
    openDetail,
    openSubDetail,
    closeSubDetail,

    setShowAllAlbumTracks,
  } = useDetailOverlayController();

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
        placeholder={activeTab.placeholder}
      />

      <TopTabs activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

      <ScrollView
        style={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TabResults
          loading={loadingSearch}
          tab={activeTab}
          data={data}
          query={query}
          openDetail={openDetail}
          openOverlay={openOverlay}
        />
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* View All overlay (same as before, now tab-driven) */}
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

      {/* Detail overlays (unchanged behavior) */}
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

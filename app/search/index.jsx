// app/search/index.jsx
import {
  Animated,
  PanResponder,
  ScrollView,
  View,
  useEffect,
  useMemo,
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

import DetailScreenOverlay from "../shared/components/search/overlays/DetailScreenOverlay";
import NestedDetailOverlay from "../shared/components/search/overlays/NestedDetailOverlay";
import SearchResultsOverlay from "../shared/components/search/overlays/SearchResultsOverlay";

import TrendingOverlay from "./ui/TrendingOverlay";

import { getTabByKey } from "./tabs";

// ✅ uses existing spotify search to seed the button background image
import { searchArtistsSpotify } from "../shared/imports";

const TAB_ORDER = ["Music", "Reviews", "Lists", "Users"];

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTopTab, setActiveTopTab] = useState("Music");
  const activeTab = getTabByKey(activeTopTab);

  const [trendingOpen, setTrendingOpen] = useState(false);
  const [popularBgUri, setPopularBgUri] = useState(null);

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

  // ✅ Seed button background from existing search artist data (no new spotify calls/endpoints)
  useEffect(() => {
    let cancelled = false;

    async function seed() {
      if (activeTopTab !== "Music") return;
      if (popularBgUri) return;

      try {
        const res = await searchArtistsSpotify("the");
        const uri = res?.artists?.[0]?.imageUrl || null;
        if (!cancelled && uri) setPopularBgUri(uri);
      } catch {
        // ignore
      }
    }

    seed();
    return () => {
      cancelled = true;
    };
  }, [activeTopTab, popularBgUri]);

  // small visual nudge on swipe
  const swipeX = useMemo(() => new Animated.Value(0), []);

  // block tab swipes while any overlay is open
  const canSwipeTabs =
    !overlayType && !detailOpen && !subDetailOpen && !trendingOpen;

  const panResponderTabs = useMemo(() => {
    const shouldStart = (_, g) => {
      if (!canSwipeTabs) return false;

      const dx = Math.abs(g.dx);
      const dy = Math.abs(g.dy);

      // only start if clearly horizontal
      return dx > 10 && dx > dy * 1.2;
    };

    return PanResponder.create({
      onMoveShouldSetPanResponder: shouldStart,
      onMoveShouldSetPanResponderCapture: shouldStart,

      onPanResponderMove: (_, g) => {
        const clamped = Math.max(-40, Math.min(40, g.dx));
        swipeX.setValue(clamped);
      },

      onPanResponderRelease: (_, g) => {
        swipeX.setValue(0);
        if (!canSwipeTabs) return;

        const dx = g.dx;
        const vx = g.vx;

        const goNext = dx < -80 || vx < -0.5; // swipe left
        const goPrev = dx > 80 || vx > 0.5; // swipe right
        if (!goNext && !goPrev) return;

        const idx = TAB_ORDER.indexOf(activeTopTab);
        const nextIdx = goNext ? idx + 1 : idx - 1;

        if (nextIdx < 0 || nextIdx >= TAB_ORDER.length) return;
        setActiveTopTab(TAB_ORDER[nextIdx]);
      },

      onPanResponderTerminate: () => swipeX.setValue(0),
    });
  }, [activeTopTab, canSwipeTabs, swipeX]);

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

      {/* ✅ button lives in TopTabs, make sure we pass handler + bg uri */}
      <TopTabs
        activeTab={activeTopTab}
        setActiveTab={setActiveTopTab}
        onOpenTrending={() => setTrendingOpen(true)}
        popularBgUri={popularBgUri}
      />

      <Animated.View
        style={{ flex: 1, transform: [{ translateX: swipeX }] }}
        {...panResponderTabs.panHandlers}
      >
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
      </Animated.View>

      <FooterBar router={router} insets={insets} />

      <SearchResultsOverlay
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
        setOpen={(v) => {
          if (!v) closeDetail();
        }}
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
        setOpen={(v) => {
          if (!v) closeSubDetail();
        }}
        detailType={subDetailType}
        detailItem={subDetailItem}
        detailLoading={detailLoading}
        albumTracks={albumTracks}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={openSubDetail}
      />

      {/* ✅ Trending overlay (slides from right, opens Nested overlay on tile press) */}
      <TrendingOverlay
        open={trendingOpen}
        onClose={() => setTrendingOpen(false)}
        insetsTop={insets.top}
        insetsBottom={insets.bottom}
        openSubDetail={openSubDetail} // ✅ THIS makes tile taps open NestedDetailOverlay
        onHeroUri={(uri) => uri && setPopularBgUri(uri)} // optional override
      />
    </View>
  );
}

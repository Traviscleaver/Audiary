// app/home/index.jsx
import { useState as useReactState, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  useRouter,
  useSafeAreaInsets,
  useState,
  View,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";
import usePopularMusic from "../shared/hooks/usePopularMusic";
import HomeHeader from "./components/HomeHeader";
import PopularCarousel from "./components/PopularCarousel";
import { ALBUMS_TAB } from "./libs/constants";
import { styles } from "./styles/styles";

import DetailScreenOverlay from "../shared/components/search/overlays/DetailScreenOverlay";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,

    ensureTracksLoaded,

    loadMoreAlbums,
    loadMoreTracks,
    albumsHasMore,
    tracksHasMore,
    tracksLoaded,
  } = usePopularMusic();

  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  // ✅ lock scrolling during page fetch
  const [scrollLocked, setScrollLocked] = useReactState(false);

  // ✅ gate so we don't trigger multiple loads from scroll events
  const pagingGateRef = useRef(false);

  // ✅ Overlay state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState("Albums");
  const [detailItem, setDetailItem] = useState(null);
  const [showAllAlbumTracks, setShowAllAlbumTracks] = useState(false);

  const openDetail = (type, item) => {
    setDetailType(type);
    setDetailItem(item);
    setShowAllAlbumTracks(false);
    setDetailOpen(true);
  };

  const isAlbums = albumsTracksTab === ALBUMS_TAB;
  const hasMore = isAlbums ? albumsHasMore : tracksHasMore;

  const pageNext = async () => {
    if (pagingGateRef.current) return;
    if (!hasMore) return;

    pagingGateRef.current = true;
    setScrollLocked(true);

    try {
      if (isAlbums) {
        await loadMoreAlbums();
      } else {
        // if user is on tracks but tracks not loaded yet, load them first
        if (!tracksLoaded) {
          await ensureTracksLoaded();
        } else {
          await loadMoreTracks();
        }
      }
    } finally {
      setScrollLocked(false);
      pagingGateRef.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <HomeHeader insetsTop={insets.top} />

      <ScrollView
        style={[styles.scroll, { paddingTop: 10 }]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={!scrollLocked} // ✅ freeze scrolling
        onScroll={({ nativeEvent }) => {
          if (scrollLocked) return;
          if (!hasMore) return;

          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const distanceFromBottom =
            contentSize.height - (layoutMeasurement.height + contentOffset.y);

          // Trigger paging when close to bottom
          const TRIGGER_PX = 250;

          if (distanceFromBottom < TRIGGER_PX) {
            pageNext();
          }
        }}
      >
        <PopularCarousel
          tab={albumsTracksTab}
          setTab={async (nextTab) => {
            setAlbumsTracksTab(nextTab);

            // if switching to tracks, load the first page immediately, and lock scroll briefly
            if (nextTab !== ALBUMS_TAB && !tracksLoaded && !loadingTracks) {
              setScrollLocked(true);
              try {
                await ensureTracksLoaded();
              } finally {
                setScrollLocked(false);
              }
            }
          }}
          popularAlbums={popularAlbums}
          tracks={tracks}
          loadingAlbums={loadingAlbums}
          loadingTracks={loadingTracks}
          onOpenDetail={openDetail}
          ensureTracksLoaded={ensureTracksLoaded}
        />

        <View style={{ height: 140 }} />
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* ✅ FULLSCREEN paging overlay while loading next batch */}
      {scrollLocked ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.35)",
            paddingBottom: insets.bottom + 70, // stays above footer
          }}
          pointerEvents="auto"
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 13 }}>
              Loading more…
            </Text>
          </View>
        </View>
      ) : null}

      <DetailScreenOverlay
        open={detailOpen}
        setOpen={setDetailOpen}
        detailType={detailType}
        detailItem={detailItem}
        detailLoading={false}
        albumTracks={[]}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={() => {}}
      />
    </View>
  );
}

// app/home/index.jsx
import {
  ScrollView,
  StatusBar,
  View,
  useRouter,
  useSafeAreaInsets,
  useState,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";
import usePopularMusic from "../shared/hooks/usePopularMusic";
import HomeHeader from "./components/HomeHeader";
import PopularCarousel from "./components/PopularCarousel";
import { ALBUMS_TAB } from "./libs/constants";
import { styles } from "./styles/styles";

import DetailScreenOverlay from "../shared/components/search/overlays/DetailScreenOverlay"; // ✅

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { popularAlbums, tracks, loadingAlbums, loadingTracks } =
    usePopularMusic();

  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  // ✅ Overlay state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState("Albums");
  const [detailItem, setDetailItem] = useState(null);

  // If you don’t have these hooked up yet, keep them as defaults:
  const [showAllAlbumTracks, setShowAllAlbumTracks] = useState(false);

  const openDetail = (type, item) => {
    setDetailType(type);
    setDetailItem(item);
    setShowAllAlbumTracks(false);
    setDetailOpen(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <HomeHeader insetsTop={insets.top} />

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
          onOpenDetail={openDetail} // ✅
        />

        <View style={{ height: 140 }} />
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* ✅ Detail Overlay (renders above everything) */}
      <DetailScreenOverlay
        open={detailOpen}
        setOpen={setDetailOpen}
        detailType={detailType}
        detailItem={detailItem}
        detailLoading={false}          // wire this later if you fetch extra
        albumTracks={[]}               // wire this later if you fetch tracks
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={() => {}}       // wire later if needed
      />
    </View>
  );
}

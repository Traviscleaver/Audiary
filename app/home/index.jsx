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

/* Hooks */
import usePopularMusic from "../shared/hooks/usePopularMusic";

import { styles } from "./styles/styles";

/* Local UI blocks */
import HomeButtons from "./components/HomeButtons";
import HomeHeader from "./components/HomeHeader";
import PopularCarousel from "./components/PopularCarousel";
import { ALBUMS_TAB } from "./libs/constants";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* 🔥 POPULAR ALBUMS + TRACKS */
  const { popularAlbums, tracks, loadingAlbums, loadingTracks } =
    usePopularMusic();

  /* 🔥 MAIN PAGE TABS */
  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <HomeHeader insetsTop={insets.top} />

      {/* MAIN CONTENT */}
      <ScrollView
        style={[styles.scroll, { paddingTop: 10 }]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* START BROWSING BUTTON GRID */}
        <HomeButtons
          onPress={() => router.push("/home")}
        />

        {/* POPULAR THIS WEEK */}
        <PopularCarousel
          tab={albumsTracksTab}
          setTab={setAlbumsTracksTab}
          popularAlbums={popularAlbums}
          tracks={tracks}
          loadingAlbums={loadingAlbums}
          loadingTracks={loadingTracks}
        />

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* FOOTER */}
      <FooterBar router={router} insets={insets} />
    </View>
  );
}

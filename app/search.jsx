import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Linking,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getAlbumTracksSpotify,
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
} from "../api/spotify";

/** ====== Style tokens ====== */
const COLORS = {
  screen: "#121212",
  navbar: "#000000",
  field: "#000000",
  fieldBorder: "transparent",
  text: "#ffffff",
  subtext: "#bfc6cf",
  faint: "#ffffffff",
  divider: "#212121",
  overlayNav: "#000000",
  active: "#1db954",
  gold: "#f5c518", // filled ★
};
const SIZES = {
  image: 64,
  sectionTitle: 28,
  rowTitle: 18,
  rowSub: 15,
  rowPaddingY: 14,
  navHeight: 56,
  footerHeight: 58,
};
const SCREEN_WIDTH = Dimensions.get("window").width;

const MAX_RESULTS_PER_SECTION = 5;
const DEFAULT_DEBOUNCE_MS = 100; // faster

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [activeTopTab, setActiveTopTab] = useState("Music");

  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showMagnifier, setShowMagnifier] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  // ====== simple per-section cache (query -> array) ======
  const cacheRef = useRef({
    albums: new Map(),
    tracks: new Map(),
    artists: new Map(),
  });

  // ========== Overlay (View All) ==========
  const [overlayType, setOverlayType] = useState(null); // "Albums" | "Tracks" | "Artists"
  const [overlayData, setOverlayData] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const overlayAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const panResponderOverlay = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) overlayAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeOverlay();
        else {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ========== Primary Detail View (Album/Artist/Track) ==========
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState(null); // "Albums" | "Tracks" | "Artists"
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [showAllAlbumTracks, setShowAllAlbumTracks] = useState(false);

  const detailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const panResponderDetail = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) detailAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeDetail();
        else {
          Animated.timing(detailAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Keep scroll position when expanding tracklist
  const detailScrollRef = useRef(null);
  const detailScrollYRef = useRef(0);

  // ====== Nested Detail View (stacked on top of detail) ======
  const [subDetailOpen, setSubDetailOpen] = useState(false);
  const [subDetailType, setSubDetailType] = useState(null); // "Albums" | "Tracks" | "Artists"
  const [subDetailItem, setSubDetailItem] = useState(null);
  const subDetailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const subDetailScrollRef = useRef(null);

  const panResponderSubDetail = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) subDetailAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeSubDetail();
        else {
          Animated.timing(subDetailAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ====== Search effect (incremental + cached + abort) ======
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setAlbums([]);
      setTracks([]);
      setArtists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Show cached immediately if we have any
    const cachedA = cacheRef.current.albums.get(q);
    const cachedT = cacheRef.current.tracks.get(q);
    const cachedR = cacheRef.current.artists.get(q);
    if (cachedA) setAlbums(cachedA.slice(0, MAX_RESULTS_PER_SECTION));
    if (cachedT) setTracks(cachedT.slice(0, MAX_RESULTS_PER_SECTION));
    if (cachedR) setArtists(cachedR.slice(0, MAX_RESULTS_PER_SECTION));

    const controllerAlbums = new AbortController();
    const controllerTracks = new AbortController();
    const controllerArtists = new AbortController();

    const timer = setTimeout(() => {
      // Fetch ALBUMS (independent)
      (async () => {
        try {
          const res = await searchAlbumsSpotify(q, { signal: controllerAlbums.signal });
          const list = res?.albums || [];
          cacheRef.current.albums.set(q, list);
          setAlbums(list.slice(0, MAX_RESULTS_PER_SECTION));
        } catch (e) {
          if (e?.name !== "AbortError") console.error("Albums error:", e);
        }
      })();

      // Fetch TRACKS (independent)
      (async () => {
        try {
          const res = await searchTracksSpotify(q, { signal: controllerTracks.signal });
          const list = res?.tracks || [];
          cacheRef.current.tracks.set(q, list);
          setTracks(list.slice(0, MAX_RESULTS_PER_SECTION));
        } catch (e) {
          if (e?.name !== "AbortError") console.error("Tracks error:", e);
        }
      })();

      // Fetch ARTISTS (independent)
      (async () => {
        try {
          const res = await searchArtistsSpotify(q, { signal: controllerArtists.signal });
          const list = res?.artists || [];
          cacheRef.current.artists.set(q, list);
          setArtists(list.slice(0, MAX_RESULTS_PER_SECTION));
        } catch (e) {
          if (e?.name !== "AbortError") console.error("Artists error:", e);
        }
      })();
    }, DEFAULT_DEBOUNCE_MS);

    // End the spinner when ALL three finish or are already cached-next-frame.
    const stopSpinner = setTimeout(() => setLoading(false), DEFAULT_DEBOUNCE_MS + 350);

    return () => {
      clearTimeout(timer);
      clearTimeout(stopSpinner);
      controllerAlbums.abort();
      controllerTracks.abort();
      controllerArtists.abort();
    };
  }, [query]);

  // ====== Overlay handlers ======
  const openOverlay = async (type) => {
    setOverlayType(type);
    setOverlayData([]);
    setOverlayLoading(true);

    overlayAnim.setValue(SCREEN_WIDTH);
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    try {
      let result = {};
      if (type === "Albums") result = await searchAlbumsSpotify(query);
      if (type === "Tracks") result = await searchTracksSpotify(query);
      if (type === "Artists") result = await searchArtistsSpotify(query);

      setOverlayData(
        type === "Albums" ? result.albums : type === "Tracks" ? result.tracks : result.artists
      );
    } catch (e) {
      console.error(e);
      setOverlayData([]);
    } finally {
      setOverlayLoading(false);
    }
  };

  const closeOverlay = () => {
    Animated.timing(overlayAnim, {
      toValue: SCREEN_WIDTH,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setOverlayType(null);
      setOverlayData([]);
      setOverlayLoading(false);
    });
  };

  // ====== Detail handlers (base layer) ======
  const openDetail = async (item, type) => {
    setDetailType(type);
    setDetailItem(item);
    setAlbumTracks([]);
    setShowAllAlbumTracks(false);
    setDetailOpen(true);

    setDetailLoading(type === "Albums");
    detailAnim.setValue(SCREEN_WIDTH);
    Animated.timing(detailAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (type === "Albums" && typeof getAlbumTracksSpotify === "function") {
      try {
        const res = await getAlbumTracksSpotify(item.id);
        const rawList =
          (res && (res.tracks || res.items)) ||
          (Array.isArray(res) ? res : []) ||
          [];
        const normalized = rawList.map((t, idx) => {
          const id = t?.id ?? `${item.id}-${idx + 1}`;
          const name = t?.name ?? `Track ${idx + 1}`;
          const tn =
            t?.track_number ??
            t?.trackNumber ??
            (typeof t?.trackNo === "number" ? t.trackNo : idx + 1);
          const artistsArr = Array.isArray(t?.artists) ? t.artists : [];
          const artists =
            artistsArr.length > 0
              ? artistsArr.map((a) => (typeof a === "string" ? a : a?.name)).filter(Boolean)
              : Array.isArray(t?.artistsNames)
              ? t.artistsNames
              : [];
          const spotifyUrl =
            t?.spotifyUrl ||
            t?.external_urls?.spotify ||
            (t?.id ? `https://open.spotify.com/track/${t.id}` : null);

          return { id, name, track_number: tn, artists, spotifyUrl };
        });

        normalized.sort((a, b) => (a.track_number ?? 0) - (b.track_number ?? 0));
        setAlbumTracks(normalized);
      } catch (err) {
        console.error("Album tracks fetch error:", err);
      } finally {
        setDetailLoading(false);
      }
    } else {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    if (subDetailOpen) {
      closeSubDetail(() => {
        closeDetail();
      });
      return;
    }

    Animated.timing(detailAnim, {
      toValue: SCREEN_WIDTH,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setDetailOpen(false);
      setDetailType(null);
      setDetailItem(null);
      setAlbumTracks([]);
      setShowAllAlbumTracks(false);
    });
  };

  // ====== Sub detail handlers (top layer) ======
  const openSubDetail = (item, type) => {
    setSubDetailType(type);
    setSubDetailItem(item);
    setSubDetailOpen(true);

    subDetailAnim.setValue(SCREEN_WIDTH);
    Animated.timing(subDetailAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeSubDetail = (onClosed) => {
    Animated.timing(subDetailAnim, {
      toValue: SCREEN_WIDTH,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSubDetailOpen(false);
      setSubDetailType(null);
      setSubDetailItem(null);
      if (onClosed) onClosed();
    });
  };

  /** ====== UI helpers ====== */
  const ExplicitBadge = () => (
    <View
      style={{
        backgroundColor: COLORS.field,
        borderColor: COLORS.divider,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
      }}
    >
      <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 12 }}>E</Text>
    </View>
  );

  const RightChevron = () => <Feather name="chevron-right" size={22} color={COLORS.subtext} />;

  const Row = ({ item, isArtist, onPress }) => {
    const img =
      item.coverUrl || item.imageUrl || item.albumCover || item.artistImage || null;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: SIZES.rowPaddingY,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.divider,
        }}
        activeOpacity={0.7}
      >
        {img ? (
          <Image
            source={{ uri: img }}
            style={{
              width: SIZES.image,
              height: SIZES.image,
              borderRadius: isArtist ? SIZES.image / 2 : 8,
              marginRight: 14,
              backgroundColor: COLORS.field,
            }}
          />
        ) : (
          <View
            style={{
              width: SIZES.image,
              height: SIZES.image,
              borderRadius: isArtist ? SIZES.image / 2 : 8,
              marginRight: 14,
              backgroundColor: COLORS.field,
            }}
          />
        )}

        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
            {item.explicit ? <ExplicitBadge /> : null}
            <Text numberOfLines={1} style={{ color: COLORS.text, fontWeight: "700", fontSize: SIZES.rowTitle }}>
              {item.title || item.name}
            </Text>
          </View>
          {item.artist ? (
            <Text numberOfLines={1} style={{ color: COLORS.subtext, fontSize: SIZES.rowSub }}>
              {item.artist}
            </Text>
          ) : null}
        </View>

        <RightChevron />
      </TouchableOpacity>
    );
  };

  const Section = ({ title, data, type }) => {
    if (!data?.length) return null;
    return (
      <View style={{ marginBottom: 28 }}>
        <Text
          style={{
            fontSize: SIZES.sectionTitle,
            fontWeight: "800",
            color: COLORS.text,
            marginBottom: 10,
          }}
        >
          {title}
        </Text>

        <FlatList
          data={data}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <Row
              item={item}
              isArtist={type === "Artists"}
              onPress={() => openDetail(item, type)}
            />
          )}
          scrollEnabled={false}
        />

        <TouchableOpacity onPress={() => openOverlay(type)} style={{ marginTop: 10 }}>
          <Text style={{ color: COLORS.subtext, fontSize: 14 }}>View all {title.toLowerCase()}...</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ====== Top Tabs visibility logic (derived) ======
  const showTabs = isFocused || hasSearched;

  const [tabsWidth, setTabsWidth] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!tabsWidth || !showTabs) return;
    const tabs = ["Music", "Reviews", "Lists", "Users"];
    const idx = Math.max(0, tabs.indexOf(activeTopTab));
    const slot = tabsWidth / 4; // 25% of the row
    setIndicator({ left: idx * slot, width: slot });
  }, [activeTopTab, showTabs, tabsWidth]);

  const TopTabs = () => {
    const tabs = ["Music", "Reviews", "Lists", "Users"];

    return (
      <View style={{ backgroundColor: COLORS.navbar }}>
        <View
          onLayout={(e) => setTabsWidth(e.nativeEvent.layout.width)}
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 8,
            borderBottomColor: COLORS.divider,
            borderBottomWidth: 1,
          }}
        >
          {/* Active 25% segment on the bottom border */}
          <View
            style={{
              position: "absolute",
              bottom: -1,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              backgroundColor: COLORS.active,
            }}
          />

          {tabs.map((t) => {
            const active = activeTopTab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTopTab(t)}
                style={{ paddingVertical: 12, flex: 1, alignItems: "center" }}
              >
                <Text
                  style={{
                    color: active ? COLORS.text : COLORS.faint,
                    fontWeight: active ? "700" : "600",
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  /** ====== Footer Bar ====== */
  const FooterBar = () => (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: SIZES.footerHeight + insets.bottom,
        backgroundColor: COLORS.navbar,
        paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 6,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.replace("/home")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="home" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="search" size={22} color={COLORS.active} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 22,
              backgroundColor: COLORS.active,
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace("/activity")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="message-circle" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/profile")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="user" size={22} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>
    </View>
  );

  /** ====== Shared detail header component ====== */
  const HeaderBar = ({ title, onBack }) => (
    <View style={{ backgroundColor: COLORS.overlayNav, paddingTop: insets.top }}>
      <View
        style={{
          height: SIZES.navHeight,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          borderBottomColor: COLORS.divider,
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ position: "absolute", left: 16 }}
        >
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{
            color: COLORS.text,
            fontSize: 17,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );

  /** ====== Generic detail body (parametrized) ====== */
  const DetailBody = ({
    type,
    item,
    loading,
    tracks,
    showAll,
    setShowAll,
    scrollRef,
    scrollYRef,
  }) => {
    if (!item) return null;

    const heroImg =
      item.coverUrl ||
      item.imageUrl ||
      item.albumCover ||
      item.artistImage ||
      null;

    const title = item.title || item.name || "";
    const subtitle = type === "Artists" ? "" : (item.artist || item.album || "");

    return (
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: SIZES.footerHeight + insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          if (scrollYRef) scrollYRef.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Artwork */}
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
          {heroImg ? (
            <Image
              source={{ uri: heroImg }}
              style={{
                width: 220,
                height: 220,
                borderRadius: type === "Artists" ? 130 : 18,
                backgroundColor: COLORS.field,
              }}
            />
          ) : (
            <View
              style={{
                width: 220,
                height: 220,
                borderRadius: type === "Artists" ? 130 : 18,
                backgroundColor: COLORS.field,
              }}
            />
          )}
        </View>

        {/* Title / Subtitle */}
        <View style={{ alignItems: "center", marginTop: 18 }}>
          <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: "800", textAlign: "center" }}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={{ color: COLORS.subtext, fontSize: 18, marginTop: 6, textAlign: "center" }}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Context row (album meta) */}
        {type === "Albums" && (
          <View style={{ alignItems: "center", marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
              {item.releaseDate ? item.releaseDate : "—"}
            </Text>
            <Text style={{ color: COLORS.subtext, marginHorizontal: 8 }}>•</Text>
            <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
              {item.trackCount != null ? `${item.trackCount} Tracks` : "—"}
            </Text>
          </View>
        )}

        {/* Rate / Play buttons (60/40) */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
          <TouchableOpacity
            style={{
              flex: 6,
              height: 48,
              borderRadius: 12,
              backgroundColor: COLORS.active,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <Feather name="star" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
              {type === "Tracks" ? "Rate Track" : type === "Albums" ? "Rate Album" : "Rate Artist"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 4,
              height: 48,
              borderRadius: 12,
              backgroundColor: COLORS.active,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            activeOpacity={0.85}
            onPress={() => {
              const url = item?.spotifyUrl;
              if (url) Linking.openURL(url);
            }}
          >
            <Feather name="play" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Play
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ratings summary */}
        <View
          style={{
            marginTop: 18,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.divider,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "33%", alignItems: "center" }}>
            <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 18 }}>0</Text>
            <Text style={{ color: COLORS.subtext, marginTop: 4 }}>Total Ratings</Text>
          </View>
          <View style={{ width: "33%", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome name="star" size={18} color={COLORS.gold} />
              <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 18 }}>0/5</Text>
            </View>
            <Text style={{ color: COLORS.subtext, marginTop: 4 }}>Average Rating</Text>
          </View>
          <View style={{ width: "33%", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Feather name="star" size={18} color={COLORS.gold} />
              <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 18 }}>0 / 5</Text>
            </View>
            <Text style={{ color: COLORS.subtext, marginTop: 4 }}>Your Rating</Text>
          </View>
        </View>

        {/* Album tracklist (only for Albums on base layer) */}
        {type === "Albums" && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 22, marginBottom: 12 }}>
              Tracks
            </Text>

            {loading ? (
              <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 24 }}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : tracks.length === 0 ? (
              <Text style={{ color: COLORS.subtext }}>No tracks found for this album.</Text>
            ) : (
              <>
                {(showAll ? tracks : tracks.slice(0, 5)).map((t, idx) => {
                  const artistNames = Array.isArray(t.artists) ? t.artists.join(", ") : (t.artist || "");
                  const num = t.track_number ?? (idx + 1);

                  const trackPayload = {
                    id: t.id,
                    name: t.name,
                    artist: artistNames,
                    coverUrl: heroImg || null,
                    album: title,
                    spotifyUrl: t.spotifyUrl || null,
                  };

                  return (
                    <View
                      key={`${t.id}-${num}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.divider,
                      }}
                    >
                      <View style={{ width: 28, alignItems: "flex-start" }}>
                        <Text style={{ color: COLORS.subtext }}>{num}</Text>
                      </View>

                      <TouchableOpacity
                        style={{ flex: 1, paddingRight: 10 }}
                        activeOpacity={0.75}
                        onPress={() => openSubDetail(trackPayload, "Tracks")}
                      >
                        <Text numberOfLines={1} style={{ color: COLORS.text, fontWeight: "700", fontSize: 16 }}>
                          {t.name}
                        </Text>
                        {!!artistNames && (
                          <Text numberOfLines={1} style={{ color: COLORS.subtext, marginTop: 2 }}>
                            {artistNames}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <FontAwesome name="star" size={18} color={COLORS.gold} />
                          <Text style={{ color: COLORS.subtext }}>—</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (t.spotifyUrl) Linking.openURL(t.spotifyUrl);
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: COLORS.active,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Feather name="play" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {tracks.length > 5 && !showAll && (
                  <TouchableOpacity
                    onPress={() => {
                      const y = (scrollYRef && scrollYRef.current) || 0;
                      setShowAll(true);
                      requestAnimationFrame(() => {
                        if (scrollRef && scrollRef.current) {
                          scrollRef.current.scrollTo({ y, animated: false });
                        }
                      });
                    }}
                    style={{ marginTop: 12 }}
                  >
                    <Text style={{ color: COLORS.subtext, textAlign: "center" }}>
                      Show full tracklist
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  /** ====== Render ====== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screen }}>
      {/* Background behind status bar */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: COLORS.navbar,
          zIndex: 1,
        }}
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Navbar */}
      <View style={{ backgroundColor: COLORS.navbar }}>
        <View
          style={{
            height: SIZES.navHeight,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            paddingBottom: 10,
            paddingHorizontal: 14,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#121212",
              borderColor: COLORS.fieldBorder,
              borderWidth: 1,
              borderRadius: 12,
              height: 45,
              paddingHorizontal: 10,
            }}
          >
            {showMagnifier && (
              <Feather name="search" size={18} color={COLORS.text} style={{ marginRight: 6 }} />
            )}
            <TextInput
              ref={inputRef}
              placeholder="Search..."
              placeholderTextColor={COLORS.faint}
              value={query}
              onChangeText={setQuery}
              onFocus={() => {
                setShowMagnifier(false);
                setIsFocused(true);
              }}
              onBlur={() => {
                setShowMagnifier(true);
                setIsFocused(false);
              }}
              style={{
                // outlineStyle is ignored on native; safe on web.
                outlineStyle: "none",
                flex: 1,
                color: COLORS.text,
                paddingVertical: 8,
                fontSize: 16,
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={18} color={COLORS.text} />
              </TouchableOpacity>
            )}
          </View>

          {(isFocused || hasSearched) ? (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setAlbums([]);
                setTracks([]);
                setArtists([]);
                setHasSearched(false);     // hides tabs when not focused
                setIsFocused(false);       // reinforce hiding
                setActiveTopTab("Music");  // reset
                inputRef.current?.blur && inputRef.current.blur();
              }}
              style={{ marginLeft: 12, height: 40, justifyContent: "center" }}
            >
              <Text style={{ color: "#c9c9c9", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Show tabs only when focused OR after a search */}
        {showTabs ? <TopTabs /> : null}
      </View>

      {/* Results */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.text} style={{ transform: [{ scale: 1.4 }] }} />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{
              paddingBottom: SIZES.footerHeight + insets.bottom + 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {activeTopTab === "Music" ? (
              <>
                <Section title="Albums" data={albums} type="Albums" />
                <Section title="Tracks" data={tracks} type="Tracks" />
                <Section title="Artists" data={artists} type="Artists" />
              </>
            ) : (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Text style={{ color: COLORS.faint }}>No content for {activeTopTab} yet.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Overlay: "View all ..." */}
      {overlayType && (
        <Animated.View
          {...panResponderOverlay.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.screen,
            transform: [{ translateX: overlayAnim }],
            zIndex: 999,
          }}
        >
          <View style={{ backgroundColor: COLORS.overlayNav, paddingTop: insets.top }}>
            <View
              style={{
                height: SIZES.navHeight,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
                borderBottomColor: COLORS.divider,
                borderBottomWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={closeOverlay}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ position: "absolute", left: 16 }}
              >
                <Feather name="arrow-left" size={22} color={COLORS.text} />
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                style={{
                  color: COLORS.text,
                  fontSize: 17,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                "{query}" in {overlayType}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, padding: 16 }}>
            {overlayLoading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator
                  size="large"
                  color={COLORS.text}
                  style={{ transform: [{ scale: 1.3 }] }}
                />
              </View>
            ) : (
              <FlatList
                data={overlayData}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                  <Row
                    item={item}
                    isArtist={overlayType === "Artists"}
                    onPress={() => openDetail(item, overlayType)}
                  />
                )}
                contentContainerStyle={{
                  paddingBottom: SIZES.footerHeight + insets.bottom + 12,
                }}
              />
            )}
          </View>
        </Animated.View>
      )}

      {/* Detail full-page view (base layer) */}
      {detailOpen && (
        <Animated.View
          {...panResponderDetail.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.screen,
            transform: [{ translateX: detailAnim }],
            zIndex: 1000,
          }}
        >
          <HeaderBar
            title={detailType === "Tracks" ? "Track" : detailType === "Albums" ? "Album" : "Artist"}
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
          />
        </Animated.View>
      )}

      {/* Sub-detail stacked over detail (e.g., Track over Album) */}
      {subDetailOpen && (
        <Animated.View
          {...panResponderSubDetail.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.screen,
            transform: [{ translateX: subDetailAnim }],
            zIndex: 1100,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <HeaderBar
            title={subDetailType === "Tracks" ? "Track" : subDetailType === "Albums" ? "Album" : "Artist"}
            onBack={() => closeSubDetail()}
          />
          <DetailBody
            type={subDetailType}
            item={subDetailItem}
            loading={false}
            tracks={[]}
            showAll={false}
            setShowAll={() => {}}
            scrollRef={subDetailScrollRef}
            scrollYRef={{ current: 0 }}
          />
        </Animated.View>
      )}

      {/* Footer bar */}
      <FooterBar />
    </SafeAreaView>
  );
}

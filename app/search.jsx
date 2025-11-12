import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
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
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
} from "../api/spotify";

/** ====== Style tokens (matches screenshot) ====== */
const COLORS = {
  screen: "#0f1216",
  navbar: "#1a1f25",
  field: "#181c22",
  fieldBorder: "transparent",
  text: "#ffffff",
  subtext: "#bfc6cf",
  faint: "#6e7681",
  divider: "#222a32",
  overlayNav: "#141a20",
};
const SIZES = {
  image: 64,
  sectionTitle: 28,
  rowTitle: 18,
  rowSub: 15,
  rowPaddingY: 14,
  navHeight: 56,
};
const SCREEN_WIDTH = Dimensions.get("window").width;

const MAX_RESULTS_PER_SECTION = 5;
const DEFAULT_DEBOUNCE_MS = 500;

export default function Search() {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [activeTopTab, setActiveTopTab] = useState("Music");

  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false); // main content loading

  const [showMagnifier, setShowMagnifier] = useState(true);
  const [debounceMs] = useState(DEFAULT_DEBOUNCE_MS);

  // TextInput ref for Cancel to blur
  const inputRef = useRef(null);

  // Overlay state
  const [overlayType, setOverlayType] = useState(null); // "Albums" | "Tracks" | "Artists"
  const [overlayData, setOverlayData] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false); // overlay spinner
  const overlayAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dx > 10,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) overlayAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeOverlay();
        else {
          Animated.spring(overlayAnim, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (query.trim().length < 2) {
      setAlbums([]);
      setTracks([]);
      setArtists([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const [a, tRes, r] = await Promise.all([
          searchAlbumsSpotify(query),
          searchTracksSpotify(query),
          searchArtistsSpotify(query),
        ]);

        if (!signal.aborted) {
          setAlbums((a?.albums || []).slice(0, MAX_RESULTS_PER_SECTION));
          setTracks((tRes?.tracks || []).slice(0, MAX_RESULTS_PER_SECTION));
          setArtists((r?.artists || []).slice(0, MAX_RESULTS_PER_SECTION));
        }
      } catch (e) {
        if (e?.name !== "AbortError") console.error(e);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }, DEFAULT_DEBOUNCE_MS);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const openOverlay = async (type) => {
    setOverlayType(type);
    setOverlayData([]);
    setOverlayLoading(true); // show centered spinner in overlay

    // Slide in immediately
    overlayAnim.setValue(SCREEN_WIDTH);
    Animated.timing(overlayAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();

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
      setOverlayLoading(false); // hide overlay spinner
    }
  };

  const closeOverlay = () => {
    Animated.timing(overlayAnim, { toValue: SCREEN_WIDTH, duration: 300, useNativeDriver: true })
      .start(() => {
        setOverlayType(null);
        setOverlayData([]);
        setOverlayLoading(false);
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

  const RightChevron = () => <Feather name="chevron-right" size={22} color={COLORS.faint} />;

  const Row = ({ item, isArtist }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SIZES.rowPaddingY,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
      }}
      activeOpacity={0.7}
    >
      {(item.coverUrl || item.imageUrl) ? (
        <Image
          source={{ uri: item.coverUrl || item.imageUrl }}
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
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Row item={item} isArtist={type === "Artists"} />}
          scrollEnabled={false}
        />

        <TouchableOpacity onPress={() => openOverlay(type)} style={{ marginTop: 10 }}>
          <Text style={{ color: COLORS.faint, fontSize: 14 }}>View all {title.toLowerCase()}...</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const TopTabs = () => {
    const tabs = ["Music", "Reviews", "Lists", "Users"];
    return (
      <View style={{ backgroundColor: COLORS.navbar }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 8,
            borderBottomColor: COLORS.divider,
            borderBottomWidth: 1,
          }}
        >
          {tabs.map((t) => {
            const active = activeTopTab === t;
            return (
              <TouchableOpacity key={t} onPress={() => setActiveTopTab(t)} style={{ paddingVertical: 12 }}>
                <Text
                  style={{
                    color: active ? COLORS.text : COLORS.faint,
                    fontWeight: active ? "700" : "600",
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
                {active ? (
                  <View style={{ height: 2, backgroundColor: COLORS.text, marginTop: 8, borderRadius: 2 }} />
                ) : (
                  <View style={{ height: 2, marginTop: 8 }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screen }}>
      {/* Color the area behind the iPhone status bar */}
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

      {/* Main navbar */}
      <View style={{ backgroundColor: COLORS.navbar }}>
        <View
          style={{
            height: SIZES.navHeight,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
          }}
        >
          {/* Search field */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.field,
              borderColor: COLORS.fieldBorder,
              borderWidth: 1,
              borderRadius: 12,
              height: 40,
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
              onFocus={() => setShowMagnifier(false)}
              onBlur={() => setShowMagnifier(true)}
              style={{ outlineStyle: "none", flex: 1, color: COLORS.text, paddingVertical: 8, fontSize: 16 }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                <Feather name="x" size={18} color={COLORS.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Cancel only clears & unfocuses */}
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setAlbums([]);
              setTracks([]);
              setArtists([]);
              inputRef.current?.blur(); // unfocus
            }}
            style={{ marginLeft: 12, height: 40, justifyContent: "center" }}
          >
            <Text style={{ color: "#c9c9c9", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Top tabs */}
        <TopTabs />
      </View>

      {/* Results area (shows centered spinner when loading) */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.text} style={{ transform: [{ scale: 1.4 }] }} />
          </View>
        ) : (
          <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
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

      {/* Slide-in overlay with its own navbar, tabs, and centered spinner */}
      {overlayType && (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: "100%",
            backgroundColor: COLORS.screen,
            transform: [{ translateX: overlayAnim }],
            zIndex: 999,
          }}
        >
          {/* Paint behind status bar for overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: insets.top,
              backgroundColor: COLORS.overlayNav,
              zIndex: 1,
            }}
          />

          {/* Overlay navbar (same height as main navbar) */}
          <View style={{ backgroundColor: COLORS.overlayNav }}>
            <View
              style={{
                height: SIZES.navHeight,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 16,
                borderBottomColor: COLORS.divider,
                borderBottomWidth: 1,
              }}
            >
              {/* Center title */}
              <Text
                numberOfLines={1}
                style={{ color: COLORS.text, fontSize: 16, fontWeight: "700" }}
              >
                showing results for '{query}'
              </Text>

              {/* Right arrow to go back */}
              <TouchableOpacity
                onPress={closeOverlay}
                hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
                style={{ position: "absolute", right: 16 }}
              >
                <Feather name="arrow-right" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Overlay top tabs (same as main) */}
            <View
              style={{
                backgroundColor: COLORS.overlayNav,
                borderBottomColor: COLORS.divider,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingHorizontal: 8,
                }}
              >
                {["Music", "Reviews", "Lists", "Users"].map((t) => {
                  const active = activeTopTab === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setActiveTopTab(t)}
                      style={{ paddingVertical: 12 }}
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
                      {active ? (
                        <View
                          style={{
                            height: 2,
                            backgroundColor: COLORS.text,
                            marginTop: 8,
                            borderRadius: 2,
                          }}
                        />
                      ) : (
                        <View style={{ height: 2, marginTop: 8 }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Overlay body */}
          <View style={{ flex: 1, padding: 16 }}>
            {overlayLoading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={COLORS.text} style={{ transform: [{ scale: 1.3 }] }} />
              </View>
            ) : (
              <FlatList
                data={overlayData}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <Row item={item} isArtist={overlayType === "Artists"} />}
              />
            )}
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

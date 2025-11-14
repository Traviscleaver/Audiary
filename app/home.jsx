// screens/home.jsx
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getAlbumTracksSpotify,
  getTopAlbumsSpotify,
  getTopTracksSpotify,
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
} from "../api/spotify";

const SCREEN_WIDTH = Dimensions.get("window").width;

/* ===== Colors ===== */
const COLORS = {
  screen: "#121212",
  navbar: "#000000",
  field: "#121212",
  fieldBorder: "transparent",
  text: "#ffffff",
  subtext: "#bfc6cf",
  faint: "#ffffff88",
  divider: "#212121",
  overlayNav: "#000000",
  active: "#1db954",
  gold: "#f5c518",
  silver: "#C0C0C0",
  bronze: "#cd7f32",
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

/* Tabs */
const ALBUMS_TAB = "ALBUMS";
const TRACKS_TAB = "TRACKS";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* ===== HOME STATE ===== */

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [showAllAlbumTracks, setShowAllAlbumTracks] = useState(false);

  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);

  /* ===== FULL SEARCH.jsx ENGINE ===== */
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracksRes, setTracksRes] = useState([]);
  const [artists, setArtists] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const hideNavForDetails = detailOpen || subDetailOpen;
  const isNavHidden = searchOpen || detailOpen || subDetailOpen || overlayType;


  const cacheRef = useRef({
    albums: new Map(),
    tracks: new Map(),
    artists: new Map(),
  });

  const DEFAULT_DEBOUNCE_MS = 100;
  const MAX_RESULTS = 5;

  /* ===== SEARCH — ABORT + CACHE + INSTANT FEEDBACK ===== */
  useEffect(() => {
    if (!searchOpen) return;

    const q = query.trim();
    if (q.length < 2) {
      setAlbums([]);
      setTracksRes([]);
      setArtists([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    setHasSearched(true);

    // Cached results instantly:
    const cA = cacheRef.current.albums.get(q);
    const cT = cacheRef.current.tracks.get(q);
    const cR = cacheRef.current.artists.get(q);

    if (cA) setAlbums(cA.slice(0, MAX_RESULTS));
    if (cT) setTracksRes(cT.slice(0, MAX_RESULTS));
    if (cR) setArtists(cR.slice(0, MAX_RESULTS));

    const controllerA = new AbortController();
    const controllerT = new AbortController();
    const controllerR = new AbortController();

    const timer = setTimeout(() => {
      // Albums
      (async () => {
        try {
          const r = await searchAlbumsSpotify(q, { signal: controllerA.signal });
          const list = r?.albums || [];
          cacheRef.current.albums.set(q, list);
          setAlbums(list.slice(0, MAX_RESULTS));
        } catch {}
      })();

      // Tracks
      (async () => {
        try {
          const r = await searchTracksSpotify(q, { signal: controllerT.signal });
          const list = r?.tracks || [];
          cacheRef.current.tracks.set(q, list);
          setTracksRes(list.slice(0, MAX_RESULTS));
        } catch {}
      })();

      // Artists
      (async () => {
        try {
          const r = await searchArtistsSpotify(q, { signal: controllerR.signal });
          const list = r?.artists || [];
          cacheRef.current.artists.set(q, list);
          setArtists(list.slice(0, MAX_RESULTS));
        } catch {}
      })();
    }, DEFAULT_DEBOUNCE_MS);

    const stop = setTimeout(
      () => setLoadingSearch(false),
      DEFAULT_DEBOUNCE_MS + 350
    );

    return () => {
      clearTimeout(timer);
      clearTimeout(stop);
      controllerA.abort();
      controllerT.abort();
      controllerR.abort();
    };
  }, [query, searchOpen]);

  /* ===== OPEN SEARCH OVERLAY ===== */
  const openSearchOverlay = () => {
    setSearchOpen(true);
    setQuery("");
    setAlbums([]);
    setTracksRes([]);
    setArtists([]);
    setHasSearched(false);

    searchAnim.setValue(SCREEN_WIDTH);
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => searchInputRef.current?.focus(), 20);
    });
  };

  /* ===== CLOSE SEARCH OVERLAY ===== */
  const closeSearchOverlay = () => {
    searchInputRef.current?.blur();


    Animated.timing(searchAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      
      setSearchOpen(false);
      setQuery("");
      setAlbums([]);
      setTracksRes([]);
      setArtists([]);
      setHasSearched(false);
    });
  };

  /* ===== PAN RESPONDER TO SWIPE CLOSE ===== */
  const panResponderSearch = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) searchAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeSearchOverlay();
        else {
          Animated.timing(searchAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  /* ====== LOADING POPULAR ALBUMS / TRACKS ====== */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [aRes, tRes] = await Promise.all([
          getTopAlbumsSpotify(39),
          getTopTracksSpotify(39),
        ]);

        if (!mounted) return;

        setPopularAlbums(aRes.albums || []);
        setTracks(tRes.tracks || []);
      } catch (e) {
        console.warn(e);
      } finally {
        if (!mounted) return;
        setLoadingAlbums(false);
        setLoadingTracks(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========  
     ROW + SECTION  
     ========== */
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

  const RightChevron = () => (
    <Feather name="chevron-right" size={22} color={COLORS.subtext} />
  );

  const Row = ({ item, isArtist, onPress }) => {
    const img =
      item.coverUrl ||
      item.imageUrl ||
      item.albumCover ||
      item.artistImage ||
      null;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.row}
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
            <Text numberOfLines={1} style={styles.rowTitle}>
              {item.title || item.name}
            </Text>
          </View>

          {item.artist && (
            <Text numberOfLines={1} style={styles.rowSub}>
              {item.artist}
            </Text>
          )}
        </View>

        <RightChevron />
      </TouchableOpacity>
    );
  };

  const Section = ({ title, data, type }) => {
    if (!data.length) return null;
    return (
      <View style={{ marginBottom: 28 }}>
        <Text style={styles.sectionHeader}>{title}</Text>

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
          <Text style={{ color: COLORS.subtext, fontSize: 14 }}>
            View all {title.toLowerCase()}...
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* ==========  
     OVERLAY (View All)  
     ========== */
  const [overlayType, setOverlayType] = useState(null);
  const [overlayData, setOverlayData] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const overlayAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const panResponderOverlay = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) overlayAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeOverlay();
        else {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openOverlay = async (type) => {
    setOverlayType(type);
    setOverlayLoading(true);
    setOverlayData([]);

    overlayAnim.setValue(SCREEN_WIDTH);
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();

    try {
      let r = {};
      if (type === "Albums") r = await searchAlbumsSpotify(query);
      if (type === "Tracks") r = await searchTracksSpotify(query);
      if (type === "Artists") r = await searchArtistsSpotify(query);

      setOverlayData(
        type === "Albums"
          ? r.albums
          : type === "Tracks"
          ? r.tracks
          : r.artists
      );
    } catch (e) {
      console.log(e);
    } finally {
      setOverlayLoading(false);
    }
  };

  const closeOverlay = () => {
    Animated.timing(overlayAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setOverlayType(null);
      setOverlayData([]);
      setOverlayLoading(false);
    });
  };

  /* ==========  
     DETAIL VIEW  
     ========== */


  const detailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const detailScrollRef = useRef(null);
  const detailScrollYRef = useRef(0);

  const panResponderDetail = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) detailAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeDetail();
        else {
          Animated.timing(detailAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openDetail = async (item, type) => {
    setDetailType(type);
    setDetailItem(item);
    setDetailLoading(type === "Albums");
    setDetailOpen(true);

    detailAnim.setValue(SCREEN_WIDTH);
    Animated.timing(detailAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();

    if (type === "Albums") {
      try {
        const res = await getAlbumTracksSpotify(item.id);
        const list =
          res?.tracks ||
          res?.items ||
          (Array.isArray(res) ? res : []) ||
          [];

        const normalized = list.map((t, idx) => ({
          id: t.id || `${item.id}-${idx + 1}`,
          name: t.name || `Track ${idx + 1}`,
          artists: Array.isArray(t.artists)
            ? t.artists.map((a) => a.name)
            : [],
          track_number:
            t.track_number ||
            t.trackNo ||
            idx + 1,
          spotifyUrl:
            t.spotifyUrl ||
            t.external_urls?.spotify ||
            (t.id && `https://open.spotify.com/track/${t.id}`),
        }));

        normalized.sort((a, b) => a.track_number - b.track_number);

        setAlbumTracks(normalized);
      } catch (err) {
        console.log(err);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const closeDetail = () => {
    if (subDetailOpen) {
      closeSubDetail(closeDetail);
      return;
    }

    Animated.timing(detailAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setDetailOpen(false);
      setDetailItem(null);
      setDetailType(null);
      setAlbumTracks([]);
      setShowAllAlbumTracks(false);
    });
  };

  /* ==========  
     SUB DETAIL  
     ========== */
  const [subDetailOpen, setSubDetailOpen] = useState(false);
  const [subDetailType, setSubDetailType] = useState(null);
  const [subDetailItem, setSubDetailItem] = useState(null);
  const subDetailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const subDetailScrollRef = useRef(null);

  const panResponderSubDetail = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) subDetailAnim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeSubDetail();
        else {
          Animated.timing(subDetailAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  const openSubDetail = (item, type) => {
    setSubDetailType(type);
    setSubDetailItem(item);
    setSubDetailOpen(true);

    subDetailAnim.setValue(SCREEN_WIDTH);
    Animated.timing(subDetailAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  };

  const closeSubDetail = (after) => {
    Animated.timing(subDetailAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setSubDetailOpen(false);
      setSubDetailItem(null);
      setSubDetailType(null);
      if (after) after();
    });
  };

  /* ==========  
     HEADER BAR (Search.jsx EXACT VERSION)
     ========== */
  const HeaderBar = ({ title, onBack }) => (
    <View style={{ backgroundColor: COLORS.navbar }}>
      <View
        style={{
          paddingTop: insets.top,
          height: SIZES.navHeight + insets.top,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          borderBottomColor: COLORS.divider,
          borderBottomWidth: 1,
        }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{
            position: "absolute",
            left: 10,
            // FIX: match text vertically
            top: insets.top + (SIZES.navHeight - 24) / 2,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {/* CENTERED TITLE */}
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.text,
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );

  /* ==========  
     DETAIL BODY  
     ========== */
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

    const hero =
      item.coverUrl ||
      item.imageUrl ||
      item.albumCover ||
      item.artistImage ||
      null;

    const title = item.title || item.name;
    const subtitle =
      type === "Artists" ? "" : item.artist || item.album;

    return (
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: SIZES.footerHeight + insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          if (scrollYRef)
            scrollYRef.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Artwork */}
        <View style={{ alignItems: "center", marginTop: 8 }}>
          {hero ? (
            <Image
              source={{ uri: hero }}
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

        {/* Title */}
        <View style={{ alignItems: "center", marginTop: 18 }}>
          <Text style={styles.detailTitle}>{title}</Text>
          {!!subtitle && (
            <Text style={styles.detailSub}>{subtitle}</Text>
          )}
        </View>

        {/* Album Meta */}
        {type === "Albums" && (
          <View style={styles.detailMeta}>
            <Text style={styles.detailMetaText}>
              {item.releaseDate || "—"}
            </Text>
            <Text style={styles.detailMetaDot}>•</Text>
            <Text style={styles.detailMetaText}>
              {item.trackCount
                ? `${item.trackCount} Tracks`
                : "—"}
            </Text>
          </View>
        )}

        {/* Rate / Play */}
        <View style={styles.detailActionsRow}>
          <TouchableOpacity style={styles.rateButton}>
            <Feather name="star" size={18} color="#fff" />
            <Text style={styles.rateButtonText}>
              {type === "Tracks"
                ? "Rate Track"
                : type === "Albums"
                ? "Rate Album"
                : "Rate Artist"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() =>
              item.spotifyUrl && Linking.openURL(item.spotifyUrl)
            }
          >
            <Feather name="play" size={18} color="#fff" />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Ratings */}
        <View style={styles.ratingsRow}>
          <View style={styles.ratingCol}>
            <Text style={styles.ratingNumber}>0</Text>
            <Text style={styles.ratingLabel}>Total Ratings</Text>
          </View>
          <View style={styles.ratingCol}>
            <View style={styles.starRow}>
              <FontAwesome name="star" size={18} color={COLORS.gold} />
              <Text style={styles.ratingNumber}>-</Text>
            </View>
            <Text style={styles.ratingLabel}>Average Rating</Text>
          </View>
          <View style={styles.ratingCol}>
            <View style={styles.starRow}>
              <Feather name="star" size={18} color={COLORS.gold} />
              <Text style={styles.ratingNumber}>-</Text>
            </View>
            <Text style={styles.ratingLabel}>Your Rating</Text>
          </View>
        </View>

        {/* Tracklist */}
        {type === "Albums" && (
          <View style={{ marginTop: 18 }}>
            <Text style={styles.trackHeader}>Tracks</Text>

            {loading ? (
              <View style={styles.trackLoader}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : tracks.length === 0 ? (
              <Text style={{ color: COLORS.subtext }}>
                No tracks found.
              </Text>
            ) : (
              <>
                {(showAll ? tracks : tracks.slice(0, 5)).map((t, idx) => {
                  const artistNames = t.artists?.join(", ");
                  const num = t.track_number ?? idx + 1;

                  return (
                    <View key={`${t.id}-${num}`} style={styles.trackRow}>
                      <View style={{ width: 28 }}>
                        <Text style={{ color: COLORS.subtext }}>{num}</Text>
                      </View>

                      <TouchableOpacity
                        style={{ flex: 1, paddingRight: 10 }}
                        onPress={() =>
                          openSubDetail(
                            {
                              id: t.id,
                              name: t.name,
                              artist: artistNames,
                              coverUrl: hero,
                              album: title,
                              spotifyUrl: t.spotifyUrl,
                            },
                            "Tracks"
                          )
                        }
                      >
                        <Text style={styles.trackTitle}>{t.name}</Text>
                        {!!artistNames && (
                          <Text style={styles.trackArtist}>{artistNames}</Text>
                        )}
                      </TouchableOpacity>

                      <View style={styles.trackButtons}>
                        <View style={styles.trackRatingRow}>
                          <FontAwesome name="star" size={18} color={COLORS.gold} />
                          <Text style={{ color: COLORS.subtext }}>—</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            t.spotifyUrl && Linking.openURL(t.spotifyUrl)
                          }
                          style={styles.trackPlayButton}
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
                      const y = scrollYRef.current || 0;
                      setShowAll(true);
                      requestAnimationFrame(() => {
                        scrollRef?.current?.scrollTo({ y, animated: false });
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
  /* ==========  
     UI — MAIN RENDER  
     ========== */
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
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* SEARCH BAR */}
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

            {/* CANCEL BUTTON OUTSIDE */}
            {searchOpen && (
              <TouchableOpacity
                onPress={closeSearchOverlay}
                style={{ paddingLeft: 10 }}
              >
                <Text style={{ color: COLORS.subtext, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      


      {/* MAIN CONTENT */}
      <ScrollView
        style={[styles.scroll, { paddingTop: 10}]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Popular Header */}
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

        {/* TIMELINE HEADER */}
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
                <Section title="Albums" data={albums} type="Albums" />
                <Section title="Tracks" data={tracksRes} type="Tracks" />
                <Section title="Artists" data={artists} type="Artists" />
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
            {
              transform: [{ translateX: overlayAnim }],
              backgroundColor: COLORS.screen,
              zIndex: 1000,
            },
          ]}
        >
          {/* Same nav bar style as Detail View */}
          <HeaderBar
            title={`"${query}" in ${overlayType}`}
            onBack={closeOverlay}
          />

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
                  <Row
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

      {/* DETAIL */}
      {detailOpen && (
        <Animated.View
          {...panResponderDetail.panHandlers}
          style={[
            styles.fullOverlay,
            {
              position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
          />
        </Animated.View>
      )}

      {/* SUB DETAIL */}
      {subDetailOpen && (
        <Animated.View
          {...panResponderSubDetail.panHandlers}
          style={[
            styles.fullOverlay,
            {
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
            },
          ]}
        >

          <HeaderBar
            title={
              subDetailType === "Tracks"
                ? "Track"
                : subDetailType === "Albums"
                ? "Album"
                : "Artist"
            }
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
    </View>
  );
}

/* ===== FOOTER ===== */
function FooterBar({ router, insets }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 58 + (insets?.bottom || 0),
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
        <TouchableOpacity onPress={() => router.replace("")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="home" size={22} color={COLORS.active} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/search")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="search" size={22} color={COLORS.subtext} />
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
            <Feather name="plus" size={22} color="#ffffff" />
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
}


/* ===== STYLES ===== */
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

  /* SEARCH OVERLAY */
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 999,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.rowPaddingY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: SIZES.rowTitle,
  },
  rowSub: {
    color: COLORS.subtext,
    fontSize: SIZES.rowSub,
  },

  sectionHeader: {
    fontSize: SIZES.sectionTitle,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },

  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 999,
  },

  centerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* DETAIL */
  detailTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  detailSub: {
    color: COLORS.subtext,
    fontSize: 18,
    marginTop: 6,
    textAlign: "center",
  },
  detailMeta: {
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  detailMetaText: { color: COLORS.subtext, fontSize: 14 },
  detailMetaDot: { color: COLORS.subtext, marginHorizontal: 8 },

  detailActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  rateButton: {
    flex: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  rateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  playButton: {
    flex: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },

  ratingsRow: {
    marginTop: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingCol: {
    width: "33%",
    alignItems: "center",
  },
  ratingNumber: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
  },
  ratingLabel: {
    color: COLORS.subtext,
    marginTop: 4,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  trackHeader: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 22,
    marginBottom: 12,
  },
  trackLoader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  trackTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  trackArtist: {
    color: COLORS.subtext,
    marginTop: 2,
  },
  trackButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  trackRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trackPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
  },
});

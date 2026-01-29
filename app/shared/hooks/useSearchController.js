/**
 * useSearchController
 * Handles the search overlay state + query updates, including debounced Spotify searches.
 * Includes a small in-memory cache for instant results and swipe-to-close gesture handling.
 */

import {
  Animated,
  Dimensions,
  PanResponder,
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
  useEffect,
  useRef,
  useState,
} from "../imports";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DEFAULT_DEBOUNCE_MS = 100;
const MAX_RESULTS = 5;

export default function useSearchController() {
  /* ===== STATE ===== */
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [albums, setAlbums] = useState([]);
  const [tracksRes, setTracksRes] = useState([]);
  const [artists, setArtists] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const cacheRef = useRef({
    albums: new Map(),
    tracks: new Map(),
    artists: new Map(),
  });

  /* ===== SEARCH EFFECT ===== */
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

    // ===== Cached instant results =====
    const cA = cacheRef.current.albums.get(q);
    const cT = cacheRef.current.tracks.get(q);
    const cR = cacheRef.current.artists.get(q);

    if (cA) setAlbums(cA.slice(0, MAX_RESULTS));
    if (cT) setTracksRes(cT.slice(0, MAX_RESULTS));
    if (cR) setArtists(cR.slice(0, MAX_RESULTS));

    const controllerA = new AbortController();
    const controllerT = new AbortController();
    const controllerR = new AbortController();

    // Debounce
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

  /* ===== SWIPE TO CLOSE ===== */
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

  return {
    searchOpen,
    query,
    albums,
    tracksRes,
    artists,
    loadingSearch,
    hasSearched,
    searchInputRef,
    searchAnim,
    panResponderSearch,
    setQuery,
    openSearchOverlay,
    closeSearchOverlay,
  };
}

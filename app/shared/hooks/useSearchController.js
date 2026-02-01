/**
 * shared/hooks/useSearchController.js
 * Generic search controller:
 * - manages search overlay open/close + query
 * - debounced fetch using the active tab plugin (tab.previewSearch)
 * - cache per tab + query so switching tabs feels instant
 */

import {
  Animated,
  Dimensions,
  PanResponder,
  useEffect,
  useRef,
  useState,
} from "../imports";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DEFAULT_DEBOUNCE_MS = 400;

export default function useSearchController({ tab }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [data, setData] = useState({}); // tab-specific shape (music: albums/tracks/artists, users, etc)

  const searchInputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // cache key: `${tabKey}::${query}`
  const cacheRef = useRef(new Map());

  useEffect(() => {
    // ✅ DO NOT REQUIRE searchOpen.
    // If SearchHeader is just an input on the page (not a sliding overlay),
    // your fetch was never running. This makes it run whenever query changes.
    if (!tab?.previewSearch) return;

    const q = query.trim();

    // Reset if query too short
    if (q.length < 2) {
      setData({});
      setLoadingSearch(false);
      return;
    }

    const cacheKey = `${tab.key}::${q}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) setData(cached);

    setLoadingSearch(true);

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await tab.previewSearch({
          query: q,
          signal: controller.signal,
        });
        cacheRef.current.set(cacheKey, res);
        setData(res);
      } catch (e) {
        // ✅ DON'T SILENCE ERRORS - log them so you can see 404s, base path issues, etc.
        console.log("previewSearch error:", e);
      } finally {
        setLoadingSearch(false);
      }
    }, DEFAULT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tab?.key]);

  const openSearchOverlay = () => {
    setSearchOpen(true);
    setQuery("");
    setData({});
    setLoadingSearch(false);

    searchAnim.setValue(SCREEN_WIDTH);
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => searchInputRef.current?.focus(), 20);
    });
  };

  const closeSearchOverlay = () => {
    searchInputRef.current?.blur();

    Animated.timing(searchAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setSearchOpen(false);
      setQuery("");
      setData({});
      setLoadingSearch(false);
    });
  };

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
    setQuery,
    loadingSearch,
    data,

    searchInputRef,
    searchAnim,
    panResponderSearch,

    openSearchOverlay,
    closeSearchOverlay,
  };
}

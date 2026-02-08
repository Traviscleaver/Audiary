/**
 * shared/hooks/useSearchController.js
 * Generic search controller:
 * - manages search overlay open/close + query
 * - debounced fetch using the active tab plugin (tab.previewSearch)
 * - cache per tab + query so switching tabs feels instant
 * - ✅ DOES NOT re-search if results already cached for the same (tab + query)
 * - ✅ clears cache when search is exited (close) or query is cleared (<2 chars)
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

function makeCacheKey(tabKey, q) {
  return `${tabKey}::${String(q || "").trim().toLowerCase()}`;
}

export default function useSearchController({ tab }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [data, setData] = useState({}); // tab-specific shape

  const searchInputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // cache key: `${tabKey}::${query}`
  const cacheRef = useRef(new Map());

  // keep a handle to the latest request so we can cancel it
  const abortRef = useRef(null);

  const clearCache = () => {
    cacheRef.current.clear();
  };

  useEffect(() => {
    if (!tab?.previewSearch) return;

    const q = query.trim();
    const tabKey = tab?.key || "UnknownTab";

    // cancel any in-flight request when tab/query changes
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;

    // Reset if query too short + clear session cache
    if (q.length < 2) {
      setData({});
      setLoadingSearch(false);
      clearCache();
      return;
    }

    const cacheKey = makeCacheKey(tabKey, q);
    const cached = cacheRef.current.get(cacheKey);

    // ✅ If cached, DO NOT re-fetch. Just show it instantly.
    if (cached) {
      setData(cached);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await tab.previewSearch({
          query: q,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        cacheRef.current.set(cacheKey, res);
        setData(res);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.log("previewSearch error:", e);
      } finally {
        if (!controller.signal.aborted) setLoadingSearch(false);
      }
    }, DEFAULT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tab?.key]);

  const openSearchOverlay = () => {
    // new search session
    clearCache();

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

    // exit search session
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    clearCache();

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

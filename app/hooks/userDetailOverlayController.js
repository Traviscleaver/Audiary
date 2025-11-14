// hooks/useDetail.js
import {
    Animated,
    Dimensions,
    PanResponder,
    getAlbumTracksSpotify,
    useRef,
    useState,
} from "../lib/imports";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function useDetail() {
  /* ====== DETAIL STATE ====== */
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailType, setDetailType] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [showAllAlbumTracks, setShowAllAlbumTracks] = useState(false);

  const detailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const detailScrollRef = useRef(null);
  const detailScrollYRef = useRef(0);

  /* ====== SUB DETAIL STATE ====== */
  const [subDetailOpen, setSubDetailOpen] = useState(false);
  const [subDetailType, setSubDetailType] = useState(null);
  const [subDetailItem, setSubDetailItem] = useState(null);

  const subDetailAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const subDetailScrollRef = useRef(null);

  /* ========================================================
      OPEN DETAIL PANEL
  ======================================================== */
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

    // If album → fetch tracks
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
          track_number: t.track_number || t.trackNo || idx + 1,
          spotifyUrl:
            t.spotifyUrl ||
            t.external_urls?.spotify ||
            (t.id && `https://open.spotify.com/track/${t.id}`),
        }));

        normalized.sort((a, b) => a.track_number - b.track_number);

        setAlbumTracks(normalized);
      } catch (e) {
        console.log("Detail track load error", e);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  /* ========================================================
      CLOSE DETAIL (handles sub-detail logic)
  ======================================================== */
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

  /* ========================================================
      PAN RESPONDER – close via swipe
  ======================================================== */
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

  /* ========================================================
      SUB DETAIL
  ======================================================== */
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

  const closeSubDetail = (after = null) => {
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

  /* ========================================================
      PAN RESPONDER – Sub-detail swipe
  ======================================================== */
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

  return {
    // DETAIL
    detailOpen,
    detailType,
    detailItem,
    detailLoading,
    albumTracks,
    showAllAlbumTracks,
    setShowAllAlbumTracks,
    detailAnim,
    detailScrollRef,
    detailScrollYRef,
    panResponderDetail,
    openDetail,
    closeDetail,

    // SUB DETAIL
    subDetailOpen,
    subDetailType,
    subDetailItem,
    subDetailAnim,
    subDetailScrollRef,
    panResponderSubDetail,
    openSubDetail,
    closeSubDetail,
  };
}

// components/DetailView.jsx
import {
  Animated,
  COLORS,
  PanResponder,
  useSafeAreaInsets
} from "../lib/imports";

import HeaderBar from "./OverlayHeaderBar";
import DetailBody from "./SearchResultDetailContent";

export default function DetailView({
  open,
  setOpen,
  detailType,
  detailItem,
  detailLoading,
  albumTracks,
  showAllAlbumTracks,
  setShowAllAlbumTracks,
  getAlbumTracksSpotify,
}) {
  const insets = useSafeAreaInsets();

  // ===== ANIMATION =====
  const SCREEN_WIDTH = 1000; // replaced in home but overwritten at runtime
  const anim = new Animated.Value(SCREEN_WIDTH);
  const scrollRef = React.useRef(null);
  const scrollYRef = React.useRef(0);

  // ===== SWIPE TO CLOSE =====
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,

      onPanResponderMove: (_, g) => {
        if (g.dx > 0) anim.setValue(g.dx);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeDetail();
        else {
          Animated.timing(anim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ===== OPEN DETAIL =====
  React.useEffect(() => {
    if (open) {
      anim.setValue(SCREEN_WIDTH);
      Animated.timing(anim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  // ===== CLOSE DETAIL =====
  const closeDetail = () => {
    Animated.timing(anim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
    });
  };

  if (!open) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.fullOverlay,
        {
          transform: [{ translateX: anim }],
          backgroundColor: COLORS.screen,
        },
      ]}
    >
      {/* HEADER */}
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

      {/* BODY */}
      <DetailBody
        type={detailType}
        item={detailItem}
        loading={detailLoading}
        tracks={albumTracks}
        showAll={showAllAlbumTracks}
        setShowAll={setShowAllAlbumTracks}
        scrollRef={scrollRef}
        scrollYRef={scrollYRef}
      />
    </Animated.View>
  );
}

const styles = {
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
};

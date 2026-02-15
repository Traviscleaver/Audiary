// app/search/ui/TrendingOverlay.jsx
import { useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";

import PopularCarousel from "../../shared/components/searchoptions/PopularCarousel";
import { ALBUMS_TAB, TRACKS_TAB } from "../../shared/lib/constants";

import {
    Animated,
    COLORS,
    Feather,
    PanResponder,
    Text,
    TouchableOpacity,
    View,
} from "../../shared/imports";

// ✅ use your real exports
import { getTopAlbumsSpotify, getTopTracksSpotify } from "../../shared/imports";

const SCREEN_W = Dimensions.get("window").width;

export default function TrendingOverlay({
  open,
  onClose,
  insetsTop = 0,
  insetsBottom = 0,
  openSubDetail, // ✅ open NestedDetailOverlay directly
  onHeroUri,     // optional: let overlay pick a nicer bg later
}) {
  const animX = useMemo(() => new Animated.Value(SCREEN_W), []);
  const [tab, setTab] = useState(ALBUMS_TAB);

  const [popularAlbums, setPopularAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const ensureTracksLoaded = async () => {
    if (tracks?.length) return;
    try {
      setLoadingTracks(true);
      const res = await getTopTracksSpotify(60, 0);
      setTracks(res?.tracks || []);
    } catch {
      // ignore
    } finally {
      setLoadingTracks(false);
    }
  };

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const res = await getTopAlbumsSpotify(60, 0);
      const next = res?.albums || [];
      setPopularAlbums(next);

      // If you ever add artistImageUrl on albums later, this will work
      const hero =
        next?.[0]?.artistImageUrl ||
        next?.[0]?.artistImage ||
        null;

      if (hero) onHeroUri?.(hero);
    } catch {
      // ignore
    } finally {
      setLoadingAlbums(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    animX.setValue(SCREEN_W);
    Animated.timing(animX, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();

    // load default tab
    setTab(ALBUMS_TAB);
    loadAlbums();
  }, [open]);

  const closeNow = () => {
    Animated.timing(animX, {
      toValue: SCREEN_W,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose?.();
    });
  };

  // ✅ horizontal swipe-back only (won't steal vertical scroll)
  const startXRef = useMemo(() => ({ current: 0 }), []);

  const panResponder = useMemo(() => {
    const shouldStart = (_, g) => {
      const dx = g.dx;
      const dy = g.dy;

      if (dx <= 0) return false;
      if (Math.abs(dx) < 12) return false;
      if (Math.abs(dx) < Math.abs(dy) * 1.8) return false;

      return true;
    };

    return PanResponder.create({
      onMoveShouldSetPanResponder: shouldStart,
      onMoveShouldSetPanResponderCapture: shouldStart,

      onPanResponderGrant: () => {
        animX.stopAnimation((value) => {
          startXRef.current = typeof value === "number" ? value : 0;
        });
      },

      onPanResponderMove: (_, g) => {
        const next = Math.max(0, Math.min(SCREEN_W, startXRef.current + g.dx));
        animX.setValue(next);
      },

      onPanResponderTerminationRequest: () => false,

      onPanResponderRelease: (_, g) => {
        const dx = g.dx;
        const vx = g.vx;

        const shouldClose = dx > SCREEN_W * 0.22 || vx > 0.65;
        if (shouldClose) closeNow();
        else {
          Animated.timing(animX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.timing(animX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    });
  }, [animX]);

  if (!open) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 900,
      }}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeNow}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Sheet (slides from right) */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.screen,
          transform: [{ translateX: animX }],
          paddingTop: insetsTop,
          paddingBottom: insetsBottom,
        }}
      >
        {/* Nav bar */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: COLORS.divider,
          }}
        >
          <TouchableOpacity
            onPress={closeNow}
            activeOpacity={0.85}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Feather name="chevron-left" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <Text
            style={{
              marginLeft: 10,
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "900",
            }}
          >
            Trending
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingTop: 8 }}>
          <PopularCarousel
            tab={tab}
            setTab={async (nextTab) => {
              if (nextTab === TRACKS_TAB) await ensureTracksLoaded();
              setTab(nextTab);
            }}
            popularAlbums={popularAlbums}
            tracks={tracks}
            loadingAlbums={loadingAlbums}
            loadingTracks={loadingTracks}
            // ✅ open nested overlay directly
            onOpenDetail={(detailType, item) => openSubDetail?.(item, detailType)}
            ensureTracksLoaded={ensureTracksLoaded}
          />
        </View>
      </Animated.View>
    </View>
  );
}

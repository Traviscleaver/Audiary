// app/home/index.jsx
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState as useReactState, useRef } from "react";
import { StyleSheet } from "react-native";

import {
  ActivityIndicator,
  COLORS,
  Feather,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useRouter,
  useSafeAreaInsets,
  useState,
  View,
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";
import useDetailOverlayController from "../shared/hooks/useDetailOverlayController";
import usePopularMusic from "../shared/hooks/usePopularMusic";

import { ALBUMS_TAB } from "../shared/lib/constants";
import HomeHeader from "./components/HomeHeader";
import { styles } from "./styles/styles";

import DetailScreenOverlay from "../shared/components/search/overlays/DetailScreenOverlay";
import NestedDetailOverlay from "../shared/components/search/overlays/NestedDetailOverlay";

import { getTopReviewsWeekly, likeReview, unlikeReview } from "../../lib/api";

/* =========================
   STARS (half-star)
========================= */
function normalizeStars(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return 0;
  const clamped = Math.max(0, Math.min(5, n));
  return Math.round(clamped * 2) / 2;
}

function StarsRow({ rating = 0, size = 14 }) {
  const normalized = useMemo(() => normalizeStars(rating), [rating]);

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      if (normalized >= i) arr.push(1);
      else if (normalized >= i - 0.5) arr.push(0.5);
      else arr.push(0);
    }
    return arr;
  }, [normalized]);

  const active = COLORS.active || "#22c55e";
  const outline = COLORS.subtext || "rgba(255,255,255,0.55)";

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {stars.map((fill, idx) => (
        <View key={`s-${idx}`} style={{ width: size, height: size, marginRight: 3 }}>
          <FontAwesome
            name="star-o"
            size={size}
            color={outline}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
          {fill > 0 && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: size,
                width: size * fill,
                overflow: "hidden",
              }}
            >
              <FontAwesome
                name="star"
                size={size}
                color={active}
                style={{ position: "absolute", left: 0, top: 0 }}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

/* =========================
   FILTER OPTION ROW
========================= */
function FilterOption({ label, sub, active, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={ui.optRow}>
      <View style={{ flex: 1 }}>
        <Text style={ui.optLabel}>{label}</Text>
        {sub ? <Text style={ui.optSub}>{sub}</Text> : null}
      </View>
      {active ? (
        <Feather name="check" size={18} color={COLORS.active || "#22c55e"} />
      ) : (
        <View style={{ width: 18 }} />
      )}
    </TouchableOpacity>
  );
}

/* =========================
   REVIEW CARD
   ✅ borderBottom is on the wrapper
   ❌ removed the old divider view entirely
========================= */
function ReviewCard({ r, onPress, onToggleLike, onCommentPress, onSharePress }) {
  const coverUrl = r.album_cover_url;

  const itemTitle =
    r.target_type === "song"
      ? r.song_title || "Song"
      : r.target_type === "album"
      ? r.album_title || "Album"
      : r.artist_name || "Artist";

  const artist = r.artist_name || "Artist";

  const reviewTitle = String(r.review_title ?? r.title ?? "").trim();
  const body = String(r.content || "").trim();
  const hasBody = body.length > 0;

  const commentCount = Number(r.comments_count ?? r.comment_count ?? r.comments ?? 0);
  const reviewerName = r.username || "User";

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={ui.card}>
      {reviewTitle ? (
        <Text style={ui.reviewTitle} numberOfLines={2}>
          {reviewTitle}
        </Text>
      ) : null}

      {hasBody ? (
        <Text style={ui.body} numberOfLines={4}>
          {body}
        </Text>
      ) : null}

      <View style={{ height: hasBody ? 12 : 8 }} />

      <View style={ui.mediaRow}>
        <View style={ui.coverWrap}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={ui.cover} />
          ) : (
            <View style={ui.coverFallback}>
              <Text style={ui.coverFallbackText}>No cover</Text>
            </View>
          )}
        </View>

        <View style={ui.mediaRight}>
          <Text style={ui.itemTitle} numberOfLines={1}>
            {itemTitle}
          </Text>

          <Text style={ui.artist} numberOfLines={1}>
            {artist}
          </Text>

          <View style={ui.starsLine}>
            <StarsRow rating={r.rating} size={14} />
            <Text style={ui.ratingNumber}>{normalizeStars(r.rating).toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={ui.bottomRow}>
        <View style={ui.bottomLeft}>
          <TouchableOpacity
            style={ui.actionBtn}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
          >
            <FontAwesome
              name={r.liked_by_me ? "heart" : "heart-o"} // ✅ filled when liked
              size={18}
              color={r.liked_by_me ? "#ff3b30" : "rgba(255,255,255,0.85)"}
            />
            <Text style={ui.actionText}>{r.likes_week ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ui.actionBtn}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onCommentPress?.();
            }}
          >
            <Feather name="message-circle" size={18} color="rgba(255,255,255,0.85)" />
            <Text style={ui.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ui.iconOnlyBtn}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onSharePress?.();
            }}
          >
            <Feather name="share-2" size={18} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>

        <Text style={ui.reviewerName} numberOfLines={1}>
          {reviewerName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* =========================
   HOME
========================= */
export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
    ensureTracksLoaded,
    loadMoreAlbums,
    loadMoreTracks,
    albumsHasMore,
    tracksHasMore,
    tracksLoaded,
  } = usePopularMusic();

  const [albumsTracksTab, setAlbumsTracksTab] = useState(ALBUMS_TAB);

  const [scrollLocked, setScrollLocked] = useReactState(false);
  const pagingGateRef = useRef(false);

  const [topReviews, setTopReviews] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [topError, setTopError] = useState(null);

  // dropdown filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState("top"); // "top" | "recent" | "rated"

  const {
    detailOpen,
    detailItem,
    detailType,
    albumTracks,
    detailLoading,
    showAllAlbumTracks,
    closeDetail,

    subDetailOpen,
    subDetailItem,
    subDetailType,
    openDetail,
    openSubDetail,
    closeSubDetail,

    setShowAllAlbumTracks,
  } = useDetailOverlayController();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingTop(true);
        setTopError(null);

        const res = await getTopReviewsWeekly(20, 0);
        if (!alive) return;

        const rows = (res?.reviews || []).map((r) => ({
          ...r,
          liked_by_me: !!r.liked_by_me,
          likes_week: Number(r.likes_week ?? 0),
        }));

        setTopReviews(rows);
      } catch (e) {
        if (!alive) return;
        setTopError(e?.error || "Failed to load top reviews");
      } finally {
        if (!alive) return;
        setLoadingTop(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const toggleLike = async (review) => {
    const id = review?.review_id;
    if (!id) return;

    const snapshot = review;

    setTopReviews((prev) =>
      prev.map((r) => {
        if (r.review_id !== id) return r;
        const nextLiked = !r.liked_by_me;
        return {
          ...r,
          liked_by_me: nextLiked,
          likes_week: Math.max(0, (r.likes_week ?? 0) + (nextLiked ? 1 : -1)),
        };
      })
    );

    try {
      if (snapshot.liked_by_me) await unlikeReview(id);
      else await likeReview(id);
    } catch (e) {
      setTopReviews((prev) => prev.map((r) => (r.review_id === id ? snapshot : r)));
    }
  };

  const modeLabel =
    reviewMode === "top"
      ? "Top reviews this week"
      : reviewMode === "recent"
      ? "Newest reviews"
      : "Highest rated";

  const displayedReviews = useMemo(() => {
    const list = [...(topReviews || [])];
    const timeKey = (r) =>
      Date.parse(r.created_at || r.createdAt || r.inserted_at || r.created || "") || 0;

    if (reviewMode === "recent") {
      return list.sort(
        (a, b) => timeKey(b) - timeKey(a) || Number(b.review_id) - Number(a.review_id)
      );
    }

    if (reviewMode === "rated") {
      return list.sort(
        (a, b) =>
          Number(b.rating ?? 0) - Number(a.rating ?? 0) ||
          Number(b.likes_week ?? 0) - Number(a.likes_week ?? 0)
      );
    }

    return list.sort((a, b) => Number(b.likes_week ?? 0) - Number(a.likes_week ?? 0));
  }, [topReviews, reviewMode]);

  const isAlbums = albumsTracksTab === ALBUMS_TAB;
  const hasMore = isAlbums ? albumsHasMore : tracksHasMore;

  const pageNext = async () => {
    if (pagingGateRef.current) return;
    if (!hasMore) return;

    pagingGateRef.current = true;
    setScrollLocked(true);

    try {
      if (isAlbums) await loadMoreAlbums();
      else {
        if (!tracksLoaded) await ensureTracksLoaded();
        else await loadMoreTracks();
      }
    } finally {
      setScrollLocked(false);
      pagingGateRef.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <HomeHeader insetsTop={insets.top} />

      <ScrollView
        style={[styles.scroll, { paddingTop: 10 }]}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={!scrollLocked}
        onScroll={({ nativeEvent }) => {
          if (scrollLocked) return;
          if (!hasMore) return;

          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const distanceFromBottom =
            contentSize.height - (layoutMeasurement.height + contentOffset.y);

          if (distanceFromBottom < 250) pageNext();
        }}
      >
        <View style={{ paddingTop: 8 }}>
          {/* Dropdown header */}
          <View style={ui.sectionHeaderRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={ui.dropdownBtn}
              onPress={() => setFilterOpen(true)}
            >
              <Text style={ui.dropdownTitle} numberOfLines={1}>
                {modeLabel}
              </Text>
              <Feather name="chevron-down" size={18} color="rgba(255,255,255,0.92)" />
            </TouchableOpacity>
          </View>

          {loadingTop ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <View style={styles.reviewLoaderRow}>
                <ActivityIndicator />
                <Text style={styles.reviewLoaderText}>Loading…</Text>
              </View>
            </View>
          ) : topError ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <Text style={styles.reviewErrorText}>{topError}</Text>
            </View>
          ) : displayedReviews.length === 0 ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <Text style={styles.reviewEmptyText}>No reviews yet.</Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              {displayedReviews.map((r) => {
                const id = String(r.review_id);
                return (
                  <ReviewCard
                    key={id}
                    r={r}
                    onPress={() => router.push(`/review/${encodeURIComponent(id)}`)}
                    onToggleLike={() => toggleLike(r)}
                    onCommentPress={() => router.push(`/review/${encodeURIComponent(id)}`)}
                    onSharePress={() => console.log("share", id)}
                  />
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* Dropdown modal */}
      {filterOpen ? (
        <View style={ui.modalWrap} pointerEvents="auto">
          <TouchableOpacity
            style={ui.modalBackdrop}
            activeOpacity={1}
            onPress={() => setFilterOpen(false)}
          />

          <View style={[ui.modalCard, { paddingBottom: insets.bottom + 14 }]}>
            <View style={ui.modalHeader}>
              <Text style={ui.modalTitle}>Feed options</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)} style={ui.modalCloseBtn}>
                <Feather name="x" size={20} color="rgba(255,255,255,0.92)" />
              </TouchableOpacity>
            </View>

            <FilterOption
              label="Top reviews this week"
              sub="Most liked"
              active={reviewMode === "top"}
              onPress={() => {
                setReviewMode("top");
                setFilterOpen(false);
              }}
            />

            <FilterOption
              label="Newest reviews"
              sub="Newest first"
              active={reviewMode === "recent"}
              onPress={() => {
                setReviewMode("recent");
                setFilterOpen(false);
              }}
            />

            <FilterOption
              label="Highest rated"
              sub="Best ratings first"
              active={reviewMode === "rated"}
              onPress={() => {
                setReviewMode("rated");
                setFilterOpen(false);
              }}
            />
          </View>
        </View>
      ) : null}

      {scrollLocked ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.35)",
            paddingBottom: insets.bottom + 70,
          }}
          pointerEvents="auto"
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 13 }}>
              Loading more…
            </Text>
          </View>
        </View>
      ) : null}

      <DetailScreenOverlay
        open={detailOpen}
        setOpen={(v) => {
          if (!v) closeDetail();
        }}
        detailType={detailType}
        detailItem={detailItem}
        detailLoading={detailLoading}
        albumTracks={albumTracks}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={openSubDetail}
      />

      <NestedDetailOverlay
        open={subDetailOpen}
        setOpen={(v) => {
          if (!v) closeSubDetail();
        }}
        detailType={subDetailType}
        detailItem={subDetailItem}
        detailLoading={detailLoading}
        albumTracks={albumTracks}
        showAllAlbumTracks={showAllAlbumTracks}
        setShowAllAlbumTracks={setShowAllAlbumTracks}
        openSubDetail={openSubDetail}
      />
    </View>
  );
}

/* =========================
   LOCAL UI STYLES
========================= */
const ui = {
  // ✅ review wrapper borderBottom (this is the fix you asked for)
  card: {
    paddingTop: 14,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.divider,
  },

  reviewTitle: { color: COLORS.text, fontWeight: "900", fontSize: 18, lineHeight: 22 },

  body: {
    marginTop: 8,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  mediaRow: { flexDirection: "row", alignItems: "center" },

  coverWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },
  cover: { width: "100%", height: "100%" },
  coverFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  coverFallbackText: { color: "rgba(255,255,255,0.75)", fontWeight: "800", fontSize: 11 },

  mediaRight: { flex: 1, marginLeft: 12 },
  itemTitle: { color: COLORS.text, fontWeight: "900", fontSize: 14 },
  artist: { marginTop: 3, color: "rgba(255,255,255,0.65)", fontWeight: "800" },

  starsLine: { marginTop: 8, flexDirection: "row", alignItems: "center" },
  ratingNumber: {
    marginLeft: 6,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "900",
    fontSize: 12,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    gap: 8,
  },
  actionText: { color: "rgba(255,255,255,0.9)", fontWeight: "900" },

  iconOnlyBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  reviewerName: {
    maxWidth: 130,
    textAlign: "right",
    color: "rgba(255,255,255,0.65)",
    fontWeight: "900",
    fontSize: 12,
  },

  // dropdown
  sectionHeaderRow: { paddingHorizontal: 16, paddingBottom: 6 },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  dropdownTitle: { flex: 1, color: COLORS.text, fontWeight: "950", fontSize: 16 },

  // modal
  modalWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalCard: {
    backgroundColor: "rgba(20,20,20,0.98)",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { color: COLORS.text, fontWeight: "950", fontSize: 16 },
  modalCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  optRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  optLabel: { color: COLORS.text, fontWeight: "900", fontSize: 14 },
  optSub: { marginTop: 3, color: "rgba(255,255,255,0.55)", fontWeight: "700", fontSize: 12 },
};

// app/home/index.jsx
import { useEffect, useMemo, useState as useReactState, useRef } from "react";

import {
  ActivityIndicator,
  Feather,
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
import { styles } from "./styles/styles";

import DetailScreenOverlay from "../shared/components/search/overlays/DetailScreenOverlay";
import NestedDetailOverlay from "../shared/components/search/overlays/NestedDetailOverlay";

import { getTopReviewsWeekly, likeReview, unlikeReview } from "../../lib/api";
import ReviewCard from "../shared/components/review/reviewCard/ReviewCard";

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

  // ✅ only two modes
  const [reviewMode, setReviewMode] = useState("top"); // "top" | "recent"

  // ✅ reddit-like view mode toggle via icon
  const [feedView, setFeedView] = useState("compact"); // "compact" | "card"

  // ✅ live clock tick so "6s" becomes "7s" etc
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

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
        setTopError(e?.error || "Failed to load reviews");
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

    // optimistic UI
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
      // revert on failure
      setTopReviews((prev) => prev.map((r) => (r.review_id === id ? snapshot : r)));
    }
  };

  const displayedReviews = useMemo(() => {
    const list = [...(topReviews || [])];
    const timeKey = (r) =>
      Date.parse(r.created_at || r.createdAt || r.inserted_at || r.created || "") || 0;

    if (reviewMode === "recent") {
      return list.sort(
        (a, b) => timeKey(b) - timeKey(a) || Number(b.review_id) - Number(a.review_id)
      );
    }

    // "top"
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

  const toggleView = () => {
    setFeedView((prev) => (prev === "compact" ? "card" : "compact"));
  };

  // Feather icons: list vs card-ish
  const viewIcon = feedView === "compact" ? "align-justify" : "credit-card";

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header (no app title) */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.feedControlsRow}>
          {/* View toggle */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleView}
            style={styles.viewToggleBtn}
          >
            <Feather name={viewIcon} size={20} color="rgba(255,255,255,0.92)" />
          </TouchableOpacity>

          {/* Mode tabs */}
          <View style={styles.feedTabsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setReviewMode("top")}
              style={styles.feedTabHitbox}
            >
              <Text
                style={[
                  styles.feedTabText,
                  reviewMode === "top" && styles.feedTabTextActive,
                ]}
              >
                Top reviews
              </Text>
            </TouchableOpacity>

            <Text style={styles.feedTabDivider}>/</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setReviewMode("recent")}
              style={styles.feedTabHitbox}
            >
              <Text
                style={[
                  styles.feedTabText,
                  reviewMode === "recent" && styles.feedTabTextActive,
                ]}
              >
                New reviews
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.scroll}
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
          <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
            {displayedReviews.map((r) => {
              const id = String(r.review_id);
              return (
                <ReviewCard
                  key={id}
                  r={r}
                  styles={styles}
                  viewMode={feedView}
                  nowMs={nowTick} // ✅ live time updates
                  onPress={() => router.push(`/review/${encodeURIComponent(id)}`)}
                  onToggleLike={() => toggleLike(r)}
                  onCommentPress={() => router.push(`/review/${encodeURIComponent(id)}`)}
                  onSharePress={() => console.log("share", id)}
                />
              );
            })}
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* overlays (unchanged) */}
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

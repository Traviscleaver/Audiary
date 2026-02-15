// app/review/[reviewId].jsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import CommentRow from "../shared/components/review/reviewCard/CommentRow";
import StaticStarRating from "../shared/components/review/StaticStarRating";

import {
    ActivityIndicator,
    COLORS,
    Feather,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    useSafeAreaInsets,
    View,
} from "../shared/imports";

import { getReviewById } from "../../lib/api";
import { styles as homeStyles } from "../home/styles/styles";

export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const reviewIdRaw = params.reviewId;
  const reviewId = Array.isArray(reviewIdRaw) ? reviewIdRaw[0] : reviewIdRaw;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [review, setReview] = useState(null);

  // TODO later: replace with API comments fetch
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!reviewId) throw { error: "Missing reviewId" };

        const res = await getReviewById(reviewId);
        if (!alive) return;
        setReview(res?.review || null);
      } catch (e) {
        if (!alive) return;
        setErr(e?.error || "Failed to load review");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [reviewId]);

  const navHeight = 52;
  const navTotal = insets.top + navHeight;

  const title = review?.song_title || review?.album_title || review?.artist_name || "Item";
  const artist = review?.artist_name || "";
  const username = review?.display_name || review?.username || "User";
  const coverUrl = review?.album_cover_url;

  // review title from DB
  const reviewTitle = String(review?.review_title ?? review?.title ?? "").trim();
  const hasReviewTitle = reviewTitle.length > 0;

  const body = String(review?.content || "").trim();
  const hasText = body.length > 0;

  return (
    <View style={homeStyles.container}>
      {/* Navbar */}
      <View style={[ui.nav, { paddingTop: insets.top, height: navTotal }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={ui.navBtn}>
          <Feather name="chevron-left" size={26} color="rgba(255,255,255,0.92)" />
        </TouchableOpacity>

        <Text style={ui.navTitle}>Review</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={ui.center}>
          <ActivityIndicator />
        </View>
      ) : err || !review ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.8)" }}>{err || "Not found"}</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {/* Header row (cover + song meta) */}
          <View style={ui.headerRow}>
            <View style={ui.coverWrap}>
              {coverUrl ? (
                <Image
                  source={{ uri: coverUrl }}
                  style={ui.cover}
                  resizeMode="contain" // ✅ never crop/warp
                />
              ) : (
                <View style={ui.coverFallback}>
                  <Text style={ui.coverFallbackText}>No cover</Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={ui.itemTitle} numberOfLines={2}>
                {title}
              </Text>

              {artist ? (
                <Text style={ui.artist} numberOfLines={1}>
                  {artist}
                </Text>
              ) : null}

              <View style={{ height: 10 }} />

              <View style={ui.metaLine}>
                <StaticStarRating value={review.rating} size={18} showNumber={false} />
                <View style={{ width: 10 }} />
                <Text style={ui.metaText}>by</Text>
                <Text style={ui.metaUser}> {username}</Text>
              </View>
            </View>
          </View>

          {/* Review Title */}
          {hasReviewTitle ? (
            <Text style={ui.reviewTitle} numberOfLines={3}>
              {reviewTitle}
            </Text>
          ) : null}

          {/* Review text */}
          <View style={{ marginTop: hasReviewTitle ? 10 : 16 }}>
            {hasText ? (
              <Text style={ui.reviewBody}>{body}</Text>
            ) : (
              <Text style={ui.reviewNoText}>(No written review)</Text>
            )}
          </View>

          {/* Divider between review and comments */}
          <View style={ui.bigDivider} />

          {/* Comments */}
          <View style={{ marginTop: 14 }}>
            <View style={ui.commentsHeader}>
              <Text style={ui.commentsTitle}>Comments</Text>
              <Text style={ui.commentsCount}>{comments.length}</Text>
            </View>

            {comments.length === 0 ? (
              <Text style={ui.commentsEmpty}>No comments yet.</Text>
            ) : (
              comments.map((c) => <CommentRow key={c.id} c={c} styles={ui} />)
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const ui = {
  nav: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.screen,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  coverWrap: {
    width: 110,
    height: 110,
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
  coverFallbackText: { color: "rgba(255,255,255,0.75)", fontWeight: "800", fontSize: 12 },

  itemTitle: { color: COLORS.text, fontWeight: "900", fontSize: 18, lineHeight: 22 },
  artist: { color: COLORS.subtext, fontWeight: "800", marginTop: 4 },

  metaLine: { flexDirection: "row", alignItems: "center" },
  metaText: { color: COLORS.subtext, fontWeight: "700" },
  metaUser: { color: COLORS.text, fontWeight: "900" },

  reviewTitle: {
    marginTop: 14,
    color: COLORS.text,
    fontWeight: "950",
    fontSize: 20,
    lineHeight: 26,
  },

  reviewBody: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    opacity: 0.95,
  },
  reviewNoText: { color: COLORS.subtext, fontWeight: "700" },

  bigDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    opacity: 0.35,
    marginTop: 16,
  },

  commentsHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  commentsTitle: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
  commentsCount: { color: COLORS.subtext, fontWeight: "800" },
  commentsEmpty: { color: COLORS.subtext, fontWeight: "700" },

  // styles consumed by shared CommentRow component:
  commentRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  commentAvatarText: { color: "rgba(255,255,255,0.9)", fontWeight: "900" },

  commentTopLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  commentUser: { color: COLORS.text, fontWeight: "900" },
  commentTime: { color: COLORS.subtext, fontWeight: "700", fontSize: 12 },
  commentBody: { color: "rgba(255,255,255,0.88)", marginTop: 6, lineHeight: 19 },
};

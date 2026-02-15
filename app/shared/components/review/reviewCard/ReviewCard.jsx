// app/shared/components/review/reviewCard/ReviewCard.jsx
import { FontAwesome } from "@expo/vector-icons";
import { Feather, Image, Text, TouchableOpacity, View } from "../../../imports";

function normalizeRating10(rating) {
  const n = Number(rating ?? 0);
  if (!Number.isFinite(n)) return "0";
  const clamped = Math.max(0, Math.min(10, n));
  const rounded = Math.round(clamped * 10) / 10; // 1 decimal max
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

// --- robust timestamp parsing ---
function parseTimestampToMs(ts) {
  if (!ts) return NaN;

  // numeric seconds or ms
  if (typeof ts === "number") return ts < 1e12 ? ts * 1000 : ts;

  const s = String(ts).trim();
  if (!s) return NaN;

  // ISO strings
  let ms = Date.parse(s);
  if (Number.isFinite(ms)) return ms;

  // "YYYY-MM-DD HH:mm:ss(.sss)" -> treat as UTC to avoid device parsing differences
  const m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?$/
  );
  if (m) {
    const year = +m[1];
    const mon = +m[2] - 1;
    const day = +m[3];
    const hh = +m[4];
    const mm = +m[5];
    const ss = +(m[6] || 0);
    const frac = m[7] ? m[7].slice(0, 3).padEnd(3, "0") : "000";
    const msPart = +frac;
    return Date.UTC(year, mon, day, hh, mm, ss, msPart);
  }

  return NaN;
}

function timeAgoFull(createdAt, nowMs) {
  const createdMs = parseTimestampToMs(createdAt);
  if (!Number.isFinite(createdMs)) return "";

  const now = Number.isFinite(nowMs) ? nowMs : Date.now();
  const diffMsRaw = now - createdMs;

  // if wildly in the future, ignore
  if (diffMsRaw < -5 * 60 * 1000) return "";

  const diffMs = Math.max(0, diffMsRaw);
  const s = Math.floor(diffMs / 1000);

  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 52) return `${w}w`;
  const y = Math.floor(d / 365);
  return `${y}y`;
}

// --- rating color (BRIGHT text) ---
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function mixRGB(c1, c2, t) {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}
function rgbToRgbaString(rgb, a = 0.98) {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}
function ratingTextColor(rating) {
  const v = Math.max(0, Math.min(10, Number(rating ?? 0)));

  const red = { r: 255, g: 0, b: 0 };
  const yellow = { r: 255, g: 200, b: 0 };
  const green = { r: 0, g: 255, b: 120 };

  if (v <= 5) {
    const t = v / 5;
    return rgbToRgbaString(mixRGB(red, yellow, t), 0.98);
  } else {
    const t = (v - 5) / 5;
    return rgbToRgbaString(mixRGB(yellow, green, t), 0.98);
  }
}

export default function ReviewCard({
  r,
  onPress,
  onToggleLike,
  onCommentPress,
  styles, // app/home/styles/styles.js
  viewMode = "compact", // "compact" | "card"
  nowMs, // ✅ passed from Home for accurate seconds ticking
}) {
  const isCard = viewMode === "card";
  if (!styles) styles = {};

  const coverUrl = r.album_cover_url;

  const itemTitle =
    r.target_type === "song"
      ? r.song_title || "Song"
      : r.target_type === "album"
      ? r.album_title || "Album"
      : r.artist_name || "Artist";

  const artist = r.artist_name || "Artist";
  const reviewerName = r.display_name || r.username || "User";

  const reviewTitle = String(r.review_title ?? r.title ?? "").trim();
  const body = String(r.content || "").trim();
  const hasBody = body.length > 0;

  const commentCount = Number(r.comments_count ?? r.comment_count ?? r.comments ?? 0);
  const likes = Number(r.likes_week ?? 0);
  const liked = !!r.liked_by_me;

  const createdAt =
    r.created_at || r.createdAt || r.inserted_at || r.created || r.rating_created_at || "";
  const timeLabel = r.time_label || r.timeLabel || timeAgoFull(createdAt, nowMs);

  const ratingText = normalizeRating10(r.rating);
  const ratingColor = ratingTextColor(r.rating);

  // -------------------------
  // COMPACT
  // -------------------------
  if (!isCard) {
    return (
      <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.feedCompactWrap}>
        {/* left thumbnail */}
        <View style={styles.feedCompactThumbWrap}>
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={styles.feedCompactThumb}
              resizeMode="contain" // ✅ never crop/warp
            />
          ) : (
            <View style={styles.feedCompactThumbFallback}>
              <Text style={styles.feedCompactThumbFallbackText}>No</Text>
            </View>
          )}
        </View>

        {/* right content */}
        <View style={styles.feedCompactRight}>
          <View style={styles.feedCompactMetaRow}>
            <Text style={styles.feedCompactMetaUser} numberOfLines={1}>
              {reviewerName}
            </Text>
            {timeLabel ? <Text style={styles.feedCompactMetaMuted}>{timeLabel}</Text> : null}
          </View>

          {reviewTitle ? (
            <Text style={styles.feedCompactTitle} numberOfLines={2}>
              {reviewTitle}
            </Text>
          ) : (
            <Text style={styles.feedCompactTitle} numberOfLines={2}>
              {itemTitle}
            </Text>
          )}

          <View style={styles.feedCompactSubRow}>
            <Text style={styles.feedCompactSubText} numberOfLines={1}>
              {itemTitle} • {artist}
            </Text>
          </View>

          {/* bottom row */}
          <View style={styles.feedCompactBottomRow}>
            <View style={styles.feedCompactActionsLeft}>
              <TouchableOpacity
                style={styles.feedCompactActionPill}
                activeOpacity={0.8}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleLike?.();
                }}
              >
                <FontAwesome
                  name={liked ? "heart" : "heart-o"}
                  size={16}
                  color={liked ? "#ff3b30" : "rgba(255,255,255,0.9)"}
                />
                <Text style={styles.feedCompactActionText}>{likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.feedCompactActionPill}
                activeOpacity={0.8}
                onPress={(e) => {
                  e.stopPropagation();
                  onCommentPress?.();
                }}
              >
                <Feather name="message-circle" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.feedCompactActionText}>{commentCount}</Text>
              </TouchableOpacity>
            </View>

            {/* rating badge */}
            <View style={styles.ratingBadge}>
              <Text style={[styles.ratingBadgeText, { color: ratingColor }]}>
                {ratingText}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // -------------------------
  // CARD
  // -------------------------
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.feedCardWrap}>
      <View style={styles.feedCardMetaRow}>
        <Text style={styles.feedCardMetaUser} numberOfLines={1}>
          {reviewerName}
        </Text>
        {timeLabel ? <Text style={styles.feedCardMetaMuted}>{timeLabel}</Text> : null}
      </View>

      {reviewTitle ? (
        <Text style={styles.feedCardTitle} numberOfLines={3}>
          {reviewTitle}
        </Text>
      ) : (
        <Text style={styles.feedCardTitle} numberOfLines={3}>
          {itemTitle}
        </Text>
      )}

      {hasBody ? (
        <Text style={styles.feedCardBody} numberOfLines={4}>
          {body}
        </Text>
      ) : null}

      <View style={styles.feedCardMediaWrap}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.feedCardMedia} resizeMode="contain" />
        ) : (
          <View style={styles.feedCardMediaFallback}>
            <Text style={styles.feedCardMediaFallbackText}>No cover</Text>
          </View>
        )}
      </View>

      <View style={styles.feedCardSubRow}>
        <Text style={styles.feedCardSubText} numberOfLines={1}>
          {itemTitle} • {artist}
        </Text>
      </View>

      <View style={styles.feedCardBottomRow}>
        <View style={styles.feedCardActionsLeft}>
          <TouchableOpacity
            style={styles.feedCardActionPill}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onToggleLike?.();
            }}
          >
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={18}
              color={liked ? "#ff3b30" : "rgba(255,255,255,0.9)"}
            />
            <Text style={styles.feedCardActionText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.feedCardActionPill}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onCommentPress?.();
            }}
          >
            <Feather name="message-circle" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.feedCardActionText}>{commentCount}</Text>
          </TouchableOpacity>
        </View>

        {/* rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={[styles.ratingBadgeText, { color: ratingColor }]}>{ratingText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

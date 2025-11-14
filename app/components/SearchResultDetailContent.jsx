// components/DetailBody.jsx
import {
    ActivityIndicator,
    COLORS,
    Feather,
    FontAwesome,
    Image,
    Linking,
    ScrollView,
    SIZES,
    Text,
    TouchableOpacity,
    View,
} from "../lib/imports";

export default function DetailBody({
  type,
  item,
  loading,
  tracks,
  showAll,
  setShowAll,
  scrollRef,
  scrollYRef,
  openSubDetail,
}) {
  if (!item) return null;

  const hero =
    item.coverUrl ||
    item.imageUrl ||
    item.albumCover ||
    item.artistImage ||
    null;

  const title = item.title || item.name;
  const subtitle = type === "Artists" ? "" : item.artist || item.album;

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: SIZES.footerHeight + 50,
      }}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => {
        if (scrollYRef)
          scrollYRef.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {/* HERO IMAGE */}
      <View style={{ alignItems: "center", marginTop: 8 }}>
        {hero ? (
          <Image
            source={{ uri: hero }}
            style={{
              width: 220,
              height: 220,
              borderRadius: type === "Artists" ? 130 : 18,
              backgroundColor: COLORS.field,
            }}
          />
        ) : (
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: type === "Artists" ? 130 : 18,
              backgroundColor: COLORS.field,
            }}
          />
        )}
      </View>

      {/* TITLE */}
      <View style={{ alignItems: "center", marginTop: 18 }}>
        <Text style={styles.detailTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.detailSub}>{subtitle}</Text>}
      </View>

      {/* ALBUM METADATA */}
      {type === "Albums" && (
        <View style={styles.detailMeta}>
          <Text style={styles.detailMetaText}>
            {item.releaseDate || "—"}
          </Text>
          <Text style={styles.detailMetaDot}>•</Text>
          <Text style={styles.detailMetaText}>
            {item.trackCount ? `${item.trackCount} Tracks` : "—"}
          </Text>
        </View>
      )}

      {/* ACTION BUTTONS */}
      <View style={styles.detailActionsRow}>
        <TouchableOpacity style={styles.rateButton}>
          <Feather name="star" size={18} color="#fff" />
          <Text style={styles.rateButtonText}>
            {type === "Tracks"
              ? "Rate Track"
              : type === "Albums"
              ? "Rate Album"
              : "Rate Artist"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() =>
            item.spotifyUrl && Linking.openURL(item.spotifyUrl)
          }
        >
          <Feather name="play" size={18} color="#fff" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      {/* RATINGS */}
      <View style={styles.ratingsRow}>
        <View style={styles.ratingCol}>
          <Text style={styles.ratingNumber}>0</Text>
          <Text style={styles.ratingLabel}>Total Ratings</Text>
        </View>

        <View style={styles.ratingCol}>
          <View style={styles.starRow}>
            <FontAwesome name="star" size={18} color={COLORS.gold} />
            <Text style={styles.ratingNumber}>-</Text>
          </View>
          <Text style={styles.ratingLabel}>Average Rating</Text>
        </View>

        <View style={styles.ratingCol}>
          <View style={styles.starRow}>
            <Feather name="star" size={18} color={COLORS.gold} />
            <Text style={styles.ratingNumber}>-</Text>
          </View>
          <Text style={styles.ratingLabel}>Your Rating</Text>
        </View>
      </View>

      {/* TRACKLIST */}
      {type === "Albums" && (
        <View style={{ marginTop: 18 }}>
          <Text style={styles.trackHeader}>Tracks</Text>

          {loading ? (
            <View style={styles.trackLoader}>
              <ActivityIndicator size="large" color={COLORS.text} />
            </View>
          ) : tracks.length === 0 ? (
            <Text style={{ color: COLORS.subtext }}>No tracks found.</Text>
          ) : (
            <>
              {(showAll ? tracks : tracks.slice(0, 5)).map((t, idx) => {
                const artistNames = t.artists?.join(", ");
                const num = t.track_number ?? idx + 1;

                return (
                  <View key={`${t.id}-${num}`} style={styles.trackRow}>
                    <View style={{ width: 28 }}>
                      <Text style={{ color: COLORS.subtext }}>{num}</Text>
                    </View>

                    <TouchableOpacity
                      style={{ flex: 1, paddingRight: 10 }}
                      onPress={() =>
                        openSubDetail({
                          id: t.id,
                          name: t.name,
                          artist: artistNames,
                          coverUrl: hero,
                          album: title,
                          spotifyUrl: t.spotifyUrl,
                        })
                      }
                    >
                      <Text style={styles.trackTitle}>{t.name}</Text>
                      {!!artistNames && (
                        <Text style={styles.trackArtist}>
                          {artistNames}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.trackButtons}>
                      <View style={styles.trackRatingRow}>
                        <FontAwesome
                          name="star"
                          size={18}
                          color={COLORS.gold}
                        />
                        <Text style={{ color: COLORS.subtext }}>—</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          t.spotifyUrl && Linking.openURL(t.spotifyUrl)
                        }
                        style={styles.trackPlayButton}
                      >
                        <Feather name="play" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {tracks.length > 5 && !showAll && (
                <TouchableOpacity
                  onPress={() => {
                    const y = scrollYRef.current || 0;
                    setShowAll(true);
                    requestAnimationFrame(() => {
                      scrollRef?.current?.scrollTo({ y, animated: false });
                    });
                  }}
                  style={{ marginTop: 12 }}
                >
                  <Text
                    style={{ color: COLORS.subtext, textAlign: "center" }}
                  >
                    Show full tracklist
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  detailTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  detailSub: {
    color: COLORS.subtext,
    fontSize: 18,
    marginTop: 6,
    textAlign: "center",
  },
  detailMeta: {
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  detailMetaText: { color: COLORS.subtext, fontSize: 14 },
  detailMetaDot: { color: COLORS.subtext, marginHorizontal: 8 },

  detailActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  rateButton: {
    flex: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  rateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  playButton: {
    flex: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },

  ratingsRow: {
    marginTop: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingCol: {
    width: "33%",
    alignItems: "center",
  },
  ratingNumber: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
  },
  ratingLabel: {
    color: COLORS.subtext,
    marginTop: 4,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  trackHeader: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 22,
    marginBottom: 12,
  },
  trackLoader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  trackTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  trackArtist: {
    color: COLORS.subtext,
    marginTop: 2,
  },
  trackButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  trackRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trackPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
  },
};

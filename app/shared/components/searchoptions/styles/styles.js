// app/home/styles/styles.js
import { COLORS, StyleSheet } from "../../../imports";

export const styles = StyleSheet.create({
  /* =========================
     BASE / LAYOUT
  ========================= */
  container: { flex: 1, backgroundColor: COLORS.screen },
  scroll: { flex: 1 },

  centerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  notchBg: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: COLORS.screen,
  },

  /* =========================
     HEADER (if you use it)
  ========================= */
  header: {
    backgroundColor: COLORS.screen,
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  appTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  /* =========================
     SECTION / TABS
  ========================= */
  sectionHeaderRow: {
    marginTop: 7,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "700",
  },

  sectionTabsRow: { flexDirection: "row", alignItems: "center" },
  sectionTabLabel: { color: COLORS.subtext, fontSize: 14, fontWeight: "600" },
  sectionTabLabelActive: { color: COLORS.active },
  sectionTabSlash: { color: COLORS.subtext, marginHorizontal: 4, fontSize: 12 },

  homeSectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  loaderWrap: { paddingVertical: 24 },
  emptyText: { color: COLORS.subtext, padding: 24, textAlign: "center" },

  /* =========================
     GRID BUTTONS (legacy / optional)
  ========================= */
  gridBtnStyle: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    // NOTE: you had this hard-coded; keep if intentional
    backgroundColor: "#ffadadff",
  },

  gridBtnTextStyle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  /* =========================
     POPULAR GRID
  ========================= */
  popularGridContent: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },

  popularGridRow: {
    justifyContent: "space-between",
  },

  popularGridItem: {
    width: "32%",
    marginBottom: 14,
  },

  popularGridCoverWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  popularGridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  popularGridTitle: {
    marginTop: 6,
    color: COLORS.text,
    fontSize: 12,
  },

  popularGridArtist: {
    marginTop: 2,
    color: COLORS.subtext,
    fontSize: 11,
  },

  /* =========================
     CAROUSEL (albums)
  ========================= */
  carouselContent: { paddingHorizontal: 16, paddingTop: 12 },

  albumCard: { width: 130, marginRight: 14, alignItems: "center" },

  albumCoverWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    position: "relative",
  },

  albumImage: { width: "100%", height: "100%" },

  albumPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  albumPlaceholderText: { color: COLORS.subtext, fontSize: 14 },

  albumTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },

  albumArtist: {
    color: COLORS.subtext,
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },

  rankBubble: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: COLORS.active,
  },

  rankText: { fontSize: 10, fontWeight: "700" },

  /* =========================
     TOP REVIEWS THIS WEEK
     (used by app/home/index.jsx ReviewCard)
  ========================= */

  // Card wrapper (touchable)
  topReviewCard: {
  paddingTop: 14,
  paddingBottom: 18,
  borderBottomWidth: 2,
  borderBottomColor: COLORS.divider,
  },


  // Title above text
  topReviewTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    lineHeight: 22,
  },

  // Body text
  topReviewBody: {
    marginTop: 8,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  // Media row
  topReviewMediaRow: { flexDirection: "row", alignItems: "center" },

  topReviewCoverWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  topReviewCover: { width: "100%", height: "100%" },

  topReviewCoverFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  topReviewCoverFallbackText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "800",
    fontSize: 11,
  },

  topReviewMediaRight: { flex: 1, marginLeft: 12 },

  topReviewItemTitle: { color: COLORS.text, fontWeight: "900", fontSize: 14 },

  topReviewArtist: {
    marginTop: 3,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "800",
  },

  topReviewStarsLine: { marginTop: 8, flexDirection: "row", alignItems: "center" },

  topReviewRatingNumber: {
    marginLeft: 6,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "900",
    fontSize: 12,
  },

  // Bottom row (buttons left, username right)
  topReviewBottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topReviewBottomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  topReviewActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    gap: 8,
  },

  topReviewActionText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "900",
  },

  topReviewIconOnlyBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  topReviewReviewerName: {
    maxWidth: 130,
    textAlign: "right",
    color: "rgba(255,255,255,0.65)",
    fontWeight: "900",
    fontSize: 12,
  },

  /* =========================
     TOP REVIEWS LOADING/ERROR TEXT
     (referenced in Home)
  ========================= */
  reviewLoaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },

  reviewLoaderText: { color: COLORS.subtext, fontSize: 13 },

  reviewErrorText: { color: "#ff7a7a", paddingVertical: 8 },

  reviewEmptyText: { color: COLORS.subtext, paddingVertical: 8 },
});

// app/shared/components/review/styles/styles.js
import { COLORS, StyleSheet } from "../../../imports";

export const styles = StyleSheet.create({
  /* =========================
     PROVIDER / SHEET
  ========================= */
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },

  sheetOuter: {
    flex: 1,
    backgroundColor: COLORS.screen || "#121212",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  handleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 6 },

  handle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  /* =========================
     BASE
  ========================= */
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 14 },

  errorText: { marginTop: 10, color: COLORS.danger || "#ff6b6b" },

  emptyCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  emptyText: { color: COLORS.subtext },

  link: { marginTop: 10, color: COLORS.text, fontWeight: "700", opacity: 0.9 },

  /* =========================
     SELECTED TARGET (TOP)
  ========================= */
  topTargetWrap: { flex: 1 },

  selectedCardWrap: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    backgroundColor: COLORS.screen || "#121212",
    borderBottomColor: COLORS.divider || "rgba(255,255,255,0.10)",
  },

  // ✅ card background removed (transparent)
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "transparent",
  },

  selectedImageWrap: { width: 54, height: 54, borderRadius: 12, overflow: "hidden" },

  selectedImageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedTextWrap: { flex: 1, marginLeft: 12 },

  selectedTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },

  selectedSubtitle: { marginTop: 2, color: COLORS.subtext, fontSize: 13 },

  selectedRightActions: { flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 10 },

  selectedActionBtn: { padding: 8 },

  // (unused if you removed "Change" from the component)
  selectedChangeText: { color: COLORS.text, fontWeight: "700", opacity: 0.85 },

  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: COLORS.divider || "rgba(255,255,255,0.12)",
  },

  typePillText: {
    color: COLORS.subtext,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 0.6,
  },

  /* =========================
     INPUTS
  ========================= */
  titleInput: {
    marginTop: 14,
    minHeight: 40,
    borderRadius: 14,
    padding: 12,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
    color: COLORS.text,
    textAlignVertical: "top",
  },

  textInput: {
    marginTop: 12,
    minHeight: 120,
    borderRadius: 14,
    padding: 12,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
    color: COLORS.text,
    textAlignVertical: "top",
  },

  /* =========================
     RATING BAR
  ========================= */
  ratingWrap: { marginTop: 2 },

  ratingBigWrap: {
    alignSelf: "center",
    paddingHorizontal: 25,
    paddingVertical: 25,
    marginBottom: 18,
  },

  ratingBigText: {
    fontSize: 35,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  ratingTrackOuter: { marginHorizontal: 6, marginBottom: 6 },

  ratingTrackStack: { position: "relative", width: "100%", justifyContent: "center" },

  ratingTrack: {
    width: "100%",
    height: 18,
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
  },

  ratingFill: { height: "100%", borderRadius: 999 },

  // ✅ ring thumb above track
  ratingThumbCircle: {
    position: "absolute",
    zIndex: 999,
    elevation: 10,
    backgroundColor: "transparent",
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ black inner that can be clipped in RatingBar.jsx when at edges
  ratingThumbInner: {
    backgroundColor: "#000",
  },

  ratingTicksRow: {
    marginTop: 8,
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  ratingTickText: { color: COLORS.subtext, fontSize: 12, fontWeight: "700" },

  ratingStepRowCentered: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },


  // placeholder colors (prevents "color undefined" crashes)
titlePlaceholder: { color: COLORS.subtext || "rgba(255,255,255,0.45)" },
textPlaceholder: { color: COLORS.subtext || "rgba(255,255,255,0.45)" },

// inline error right under the title bubble
inlineErrorUnderInput: {
  marginTop: 6,
  marginLeft: 6,
  color: COLORS.danger || "#ff6b6b",
  fontWeight: "700",
  fontSize: 12,
},

  ratingStepBtnSmall: {
    minWidth: 80,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  ratingStepBtnTextSmall: { fontWeight: "900", color: COLORS.text, fontSize: 16 },

  ratingStepBtnDisabled: { opacity: 0.5 },

  /* =========================
     STICKY FOOTER
  ========================= */
  stickyActionBar: {
    left: 0,
    right: 0,
    bottom: 0,

    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 40,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderTopWidth: 1,
    borderTopColor: COLORS.divider || "rgba(255,255,255,0.10)",
    backgroundColor: COLORS.screen || "#121212",
  },

  stickyExitBtn: { paddingVertical: 12, paddingHorizontal: 14 },

  stickyExitText: { color: COLORS.text, fontWeight: "900", opacity: 0.9 },

  stickyReviewBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: COLORS.active || "#22c55e",
  },

  stickyReviewText: { color: COLORS.text, fontWeight: "900" },

  /* =========================
     SEARCH PICKER (IF USED)
  ========================= */
  searchHeaderWrap: { backgroundColor: COLORS.screen || "#121212" },

  searchHintText: { color: COLORS.subtext, paddingVertical: 6, paddingHorizontal: 16 },

  searchErrorText: {
    color: COLORS.danger || "#ff6b6b",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },

  searchLoadingWrap: { paddingTop: 20 },

  sectionHeader: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  rowType: { display: "none" },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16 },

  rowImageWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  rowTextWrap: { flex: 1, marginLeft: 12 },

  rowTitle: { color: COLORS.text, fontWeight: "900" },

  rowSubtitle: { color: COLORS.subtext, marginTop: 2 },

  separator: { height: 1, backgroundColor: COLORS.divider, opacity: 0.25, marginHorizontal: 16 },

  /* =========================
     ✅ VIEW ALL STYLES (RESTORED)
  ========================= */
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  viewAllText: {
    opacity: 0.85,
    color: COLORS.text,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  viewAllTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },

  viewAllBackText: {
    opacity: 0.85,
    color: COLORS.text,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  viewAllTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
  },





ratingThumbCircle: {
  position: "absolute",
  zIndex: 999,
  elevation: 10,
  backgroundColor: "transparent",
  borderWidth: 3, // ✅ thinner ring (was 5)
  alignItems: "center",
  justifyContent: "center",
},

ratingThumbInner: {
  zIndex: 998,
  backgroundColor: "#000",
},
});

export default styles;

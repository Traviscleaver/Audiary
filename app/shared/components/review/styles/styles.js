// app/shared/components/review/styles/styles.js
import { COLORS, StyleSheet } from "../../../imports";

export const styles = StyleSheet.create({
  // ---------- Provider / sheets ----------
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  sheetOuter: {
    flex: 1,
    backgroundColor: COLORS.screen || "#121212",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  handleWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },

  handle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  headerRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider || "rgba(255,255,255,0.08)",
  },

  headerExitBtn: { paddingVertical: 8 },
  headerExitText: { color: COLORS.text, fontWeight: "800" },
  headerTitle: { color: COLORS.text, fontWeight: "900", fontSize: 18 },
  headerSpacer: { width: 44 },

  // ---------- Review base ----------
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: { flex: 1 },

  content: { paddingHorizontal: 14 },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 13,
    color: COLORS.text,
  },

  emptyCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  emptyText: { color: COLORS.subtext },

  link: {
    marginTop: 10,
    color: COLORS.text,
    fontWeight: "700",
    opacity: 0.9,
  },

  errorText: {
    marginTop: 10,
    color: COLORS.danger || "#ff6b6b",
  },

  // ---------- SelectedTargetCard ----------
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  selectedImageWrap: {
    width: 54,
    height: 54,
    borderRadius: 12,
    overflow: "hidden",
  },

  selectedImageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedTextWrap: { flex: 1, marginLeft: 12 },

  selectedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  selectedSubtitle: {
    marginTop: 2,
    color: COLORS.subtext,
    fontSize: 13,
  },

  selectedActionBtn: { padding: 8 },

  selectedChangeText: {
    color: COLORS.text,
    fontWeight: "700",
    opacity: 0.85,
  },

  // ---------- ReviewForm ----------
  label: { fontSize: 14, color: COLORS.subtext },
  labelSpacingBottom: { marginBottom: 8 },
  labelSpacingTop: { marginTop: 16, marginBottom: 8 },

  textInput: {
    minHeight: 120,
    borderRadius: 14,
    padding: 12,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
    color: COLORS.text,
    textAlignVertical: "top",
  },

  titleInput: {
    minHeight: 40,
    borderRadius: 14,
    padding: 12,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
    color: COLORS.text,
    textAlignVertical: "top",
  },


  saveBtn: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  saveBtnDisabled: { backgroundColor: "rgba(255,255,255,0.12)" },
  saveBtnEnabled: { backgroundColor: COLORS.active || "#22c55e" },

  saveBtnText: { fontWeight: "900", color: COLORS.text },

  helperText: { marginTop: 10, color: COLORS.subtext, fontSize: 12 },

  // ---------- Search sheet ----------
  searchHeaderWrap: { backgroundColor: COLORS.screen || "#121212" },

  searchHintText: {
    color: COLORS.subtext,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },

  searchErrorText: {
    color: COLORS.danger || "#ff6b6b",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },

  searchLoadingWrap: { paddingTop: 20 },

  sectionHeader: {
    color: COLORS.text,        // was subtext
    fontWeight: "900",
    fontSize: 18,              // ✅ bigger
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  // Remove right-side type label (we won't render it anymore)
  rowType: {
    display: "none",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

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

  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
    opacity: 0.25,
    marginHorizontal: 16,
  },

  // ---------- Stars ----------
  starsRow: { flexDirection: "row", alignItems: "center" },
  ratingNumber: { marginLeft: 10, color: COLORS.subtext },

  starPressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 8,
  },

  viewAllText: {
    opacity: 0.8,
    color: COLORS.text,
    textDecorationLine: "underline",
  },

  viewAllTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 4,
  },

  viewAllBackText: {
    opacity: 0.85,
    color: COLORS.text,
    textDecorationLine: "underline",
  },

  viewAllTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
  },
  
});



export default styles;

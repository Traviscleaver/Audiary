// app/review/styles/styles.js
import { StyleSheet, COLORS } from "../../shared/imports";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: COLORS.text,
  },

  emptyCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  emptyText: {
    color: COLORS.subtext,
  },

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

  // --------------------------
  // SelectedTargetCard styles
  // --------------------------
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

  selectedTextWrap: {
    flex: 1,
    marginLeft: 12,
  },

  selectedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text, // ✅ FIX black text
  },

  selectedSubtitle: {
    marginTop: 2,
    color: COLORS.subtext,
    fontSize: 13,
  },

  selectedActionBtn: {
    padding: 8,
  },

  selectedChangeText: {
    color: COLORS.text, // ✅ readable
    fontWeight: "700",
    opacity: 0.85,
  },
});

// ✅ ALSO export default so imports can’t break
export default styles;

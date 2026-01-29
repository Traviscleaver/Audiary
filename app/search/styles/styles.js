import { COLORS, StyleSheet } from "../../shared/imports";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.screen },

  notchBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: COLORS.navbar,
  },

  navbar: {
    backgroundColor: COLORS.navbar,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  searchRow: { width: "100%", flexDirection: "row", alignItems: "center" },

  searchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.screen,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flex: 1,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 6,
  },

  cancelText: { color: COLORS.subtext, fontSize: 16 },

  resultsScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
});

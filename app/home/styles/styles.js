import { COLORS, StyleSheet } from "../../shared/imports";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screen },

  header:{
    backgroundColor: COLORS.navbar,
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  appTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.screen,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    color: COLORS.text,
  },

  scroll: { flex: 1 },

  sectionHeaderRow: {
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: COLORS.text, fontSize: 20, fontWeight: "700" },

  sectionTabsRow: { flexDirection: "row", alignItems: "center" },
  sectionTabLabel: { color: COLORS.subtext, fontSize: 12, fontWeight: "600" },
  sectionTabLabelActive: { color: COLORS.active },
  sectionTabSlash: { color: COLORS.subtext, marginHorizontal: 4, fontSize: 12 },

  loaderWrap: { paddingVertical: 24 },
  emptyText: { color: COLORS.subtext, padding: 24, textAlign: "center" },

  carouselContent: { paddingHorizontal: 16, paddingTop: 12 },

  albumCard: { width: 130, marginRight: 14, alignItems: "center" },
  albumCoverWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
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
  albumArtist: { color: COLORS.subtext, fontSize: 11, marginTop: 2, textAlign: "center" },

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

  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 999,
  },

  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 9099,
  },

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
    backgroundColor: COLORS.navbar,
  },
});

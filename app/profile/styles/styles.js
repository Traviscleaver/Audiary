// app/profile/styles/styles.js
import { AVATAR_SCALE, COLORS, SIZES, StyleSheet } from "../../shared/imports";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },

  scrollContent: {
    paddingBottom: 40,
    backgroundColor: COLORS.screen,
  },

  scrollInner: {
    backgroundColor: COLORS.screen,
  },

  notchBg: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: COLORS.screen,
  },

  topBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.screen,
  },

  // ===== Top Bar =====
  topBar: {
    paddingHorizontal: SIZES.pad,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topBarIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.screen,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  topBarRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  // ===== Header =====
  igHeaderWrap: {
    paddingHorizontal: SIZES.pad,
    paddingTop: 6,
    paddingBottom: 10,
  },
  igHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  igLeftCol: {
    width: SIZES.avatar * AVATAR_SCALE + 10,
  },
  avatar: {
    width: SIZES.avatar * AVATAR_SCALE,
    height: SIZES.avatar * AVATAR_SCALE,
    borderRadius: (SIZES.avatar * AVATAR_SCALE) / 2,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  igBioText: {
    marginTop: 10,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.95,
  },

  // ✅ Wide IG-style buttons (80% of page)
  profileBtnWrap: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  profileBtn: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtnText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  igRightCol: {
    flex: 1,
    paddingTop: 10,
  },

  igGivenName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 6,
  },

  igStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  inlineGroupIg: { alignItems: "left", flex: 1 },
  inlineCountIg: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  inlineLabelIg: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

  // ===== Tabs =====
  tabsBar: {
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: "row",
    paddingHorizontal: SIZES.pad,
    marginTop: 6,
  },
  tabWrap: { flex: 1, alignItems: "center" },
  tabPad: { paddingVertical: 12 },
  tabText: { color: COLORS.subtext, fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: COLORS.text, fontWeight: "700" },
  tabUnderline: { height: 2, width: "100%", backgroundColor: "transparent" },
  tabUnderlineOn: { backgroundColor: COLORS.active },

  // ===== Sections =====
  section: { marginTop: 18 },
  sectionHeader: { paddingHorizontal: SIZES.pad, marginBottom: 10 },
  sectionTitle: { color: COLORS.text, fontSize: 22, fontWeight: "800" },

  sliderContent: { paddingHorizontal: SIZES.pad },
  sliderItem: { width: SIZES.cardWidth, marginRight: SIZES.cardGap },
  cover: {
    width: SIZES.cover,
    height: SIZES.cover,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.coverRadius,
  },

  placeholderLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    opacity: 0.7,
    width: "80%",
  },

  emptyWrap: { paddingHorizontal: SIZES.pad, paddingVertical: 16 },
  placeholderText: { color: COLORS.subtext },
});

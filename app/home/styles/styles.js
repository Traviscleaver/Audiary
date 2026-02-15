// app/home/styles/styles.js
import { COLORS, StyleSheet } from "../../shared/imports";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screen },
  scroll: { flex: 1 },

  /* blank navbar container */
  navBlank: {
    backgroundColor: COLORS.screen,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  /* section title */
  sectionTitle: {
    color: COLORS.text,
    fontWeight: "950",
    fontSize: 18,
    marginBottom: 10,
  },

  /* =========================
     TRENDING
  ========================= */
  trendingTabsBar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 6,
    marginBottom: 12,
  },

  trendingLoaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },

  trendingRow: {
    paddingRight: 8,
    paddingBottom: 10,
  },

  trendingItem: {
    width: 74,
    height: 74,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  trendingCover: { width: "100%", height: "100%" },

  trendingCoverFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  trendingCoverFallbackText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  /* =========================
     FEED CONTROLS (moved here)
  ========================= */
  feedControlsBar: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  feedControlsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  viewToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  feedTabsRow: { flexDirection: "row", alignItems: "center" },

  feedTabHitbox: { paddingVertical: 8, paddingHorizontal: 6 },

  feedTabText: {
    color: "rgba(255,255,255,0.70)",
    fontWeight: "900",
    fontSize: 15,
  },

  feedTabTextActive: { color: COLORS.active || "#22c55e" },

  feedTabDivider: {
    marginHorizontal: 6,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "900",
  },

  /* loading / errors */
  reviewLoaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  reviewLoaderText: { color: COLORS.subtext, fontSize: 13 },
  reviewErrorText: { color: "#ff7a7a", paddingVertical: 8 },
  reviewEmptyText: { color: COLORS.subtext, paddingVertical: 8 },

  /* =========================
     COMPACT
  ========================= */
  feedCompactWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },

  // ✅ make cover a true 1:1 box (no stretching)
  feedCompactThumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },

  // ✅ contain = never crop, never morph. may letterbox, but stays correct
  feedCompactThumb: { width: "100%", height: "100%", resizeMode: "contain" },

  feedCompactThumbFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  feedCompactThumbFallbackText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  feedCompactRight: { flex: 1, marginLeft: 12 },

  feedCompactMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    justifyContent: "space-between", // helps the time sit right
  },
  feedCompactMetaUser: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "900",
    fontSize: 12,
    maxWidth: 220,
  },
  feedCompactMetaMuted: { color: "rgba(255,255,255,0.55)", fontWeight: "800", fontSize: 12 },

  feedCompactTitle: { color: COLORS.text, fontWeight: "950", fontSize: 16, lineHeight: 20 },

  // ✅ tighten spacing above actions
  feedCompactSubRow: { marginTop: 2 },
  feedCompactSubText: { color: "rgba(255,255,255,0.62)", fontWeight: "800", fontSize: 12 },

  // ✅ less gap above like/comment row
  feedCompactBottomRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  feedCompactActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  // ✅ NO background, NO border
  feedCompactActionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 0,
    paddingVertical: 6,
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
  },
  feedCompactActionText: { color: "rgba(255,255,255,0.9)", fontWeight: "950" },

  /* =========================
     CARD (no background/border)
  ========================= */
  feedCardWrap: {
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
  },

  feedCardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  feedCardMetaUser: { color: "rgba(255,255,255,0.85)", fontWeight: "950", fontSize: 12 },
  feedCardMetaMuted: { color: "rgba(255,255,255,0.55)", fontWeight: "800", fontSize: 12 },

  feedCardTitle: { color: COLORS.text, fontWeight: "950", fontSize: 18, lineHeight: 22 },

  feedCardBody: {
    marginTop: 8,
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  // ✅ 1:1 media area + contain image
  feedCardMediaWrap: {
    marginTop: 12,
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
  },
  feedCardMedia: { width: "100%", height: "100%", resizeMode: "contain" },

  feedCardMediaFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  feedCardMediaFallbackText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  // ✅ tighten spacing above actions
  feedCardSubRow: { marginTop: 8 },
  feedCardSubText: { color: "rgba(255,255,255,0.62)", fontWeight: "800" },

  // ✅ less gap above like/comment row
  feedCardBottomRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  feedCardActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  // ✅ NO background, NO border
  feedCardActionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 0,
    paddingVertical: 6,
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
  },
  feedCardActionText: { color: "rgba(255,255,255,0.9)", fontWeight: "950" },

  /* =========================
     RATING BADGE (shared)
  ========================= */
  ratingBadge: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  ratingBadgeText: {
    fontWeight: "999",
    fontSize: 18,
    letterSpacing: 0.2,
    // color is injected dynamically in ReviewCard so it can "grade" the rating
  },
});

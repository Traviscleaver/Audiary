// app/profile/components/settings/styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../../shared/imports";

export const overlayStyles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3000,
  },

  screenFill: { ...StyleSheet.absoluteFillObject },
  overlayBackground: { ...StyleSheet.absoluteFillObject },

  settingsSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    overflow: "hidden",
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.screen,
  },

  sheetCancel: { color: COLORS.subtext, fontSize: 16 },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  sheetSave: { color: COLORS.active, fontSize: 16, fontWeight: "700" },

  sheetScroll: { backgroundColor: COLORS.screen },

  smallHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.subtext,
    marginLeft: 16,
    marginTop: 25,
  },

  rowEditable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.screen,
  },

  rowTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    alignItems: "center",
    backgroundColor: COLORS.screen,
  },

  rowToggle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    alignItems: "center",
    backgroundColor: COLORS.screen,
  },

  rowChevron: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    alignItems: "center",
    backgroundColor: COLORS.screen,
  },

  chevron: {
    color: COLORS.subtext,
    fontSize: 18,
    fontWeight: "400",
    marginLeft: 12,
  },

  editLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },

  editInput: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "left",
    padding: 6,
    margin: 0,
    minWidth: 80,
    flex: 1,
    maxWidth: "70%",
  },

  editValue: {
    color: COLORS.subtext,
    fontSize: 16,
    maxWidth: "100%",
    textAlign: "right",
  },

  toggle: {
    width: 52,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: "center",
    borderWidth: 1,
  },

  toggleOff: { backgroundColor: COLORS.buttonOff, borderColor: COLORS.divider },
  toggleOn: { backgroundColor: COLORS.buttonOn, borderColor: COLORS.screen },

  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#fff",
  },

  knobOff: { alignSelf: "flex-start" },
  knobOn: { alignSelf: "flex-end" },

  subOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.screen,
    zIndex: 9999,
    overflow: "hidden",
  },

  subHeader: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.screen,
  },

  subBack: {
    color: COLORS.subtext,
    fontSize: 16,
    fontWeight: "500",
    width: 50,
  },

  subTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },

  emptyStateWrap: { paddingHorizontal: 16, paddingVertical: 20 },
  emptyStateTitle: { color: COLORS.text, fontSize: 16, fontWeight: "800", marginBottom: 6 },
  emptyStateSub: { color: COLORS.subtext, fontSize: 13, lineHeight: 18 },

  popupWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
  },

  popupBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  popupCard: {
    width: "86%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: 16,
  },

  popupText: { color: COLORS.subtext, fontSize: 14, lineHeight: 18, marginBottom: 20 },

  popupBtn: {
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
  },

  popupBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});

import { COLORS, SIZES, StyleSheet } from "../../shared/imports";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },

  navbarWrap: {
    backgroundColor: COLORS.screen,
  },
  navbarInner: {
    height: SIZES.navHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    color: COLORS.subtext,
    fontSize: 16,
    fontWeight: "600",
  },
  navTextActive: {
    color: COLORS.text,
    fontWeight: "700",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: COLORS.active,
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },

  centerWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.pad * 2,
    width: "100%",
  },

  inviteText: {
    color: COLORS.subtext,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  inviteButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  inviteButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  startChatText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },

  subtext: {
    color: COLORS.subtext,
    fontSize: 16,
  },
});
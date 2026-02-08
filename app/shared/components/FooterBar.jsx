// app/shared/components/FooterBar.jsx
import { usePathname } from "expo-router";
import React from "react";
import { COLORS, Feather, TouchableOpacity, View } from "../imports";
import { useReviewOverlay } from "./review/ReviewOverlayProvider"; // ✅ overlay hook

export default function FooterBar({ router, insets }) {
  const pathname = usePathname();
  const { openReview } = useReviewOverlay(); // ✅ MUST be inside provider

  const TABS = [
    { route: "/home", icon: "home" },
    { route: "/search", icon: "search" },
    { route: "__review_overlay__", icon: "plus", isCenter: true }, // ✅ not a real route anymore
    { route: "/activity", icon: "message-circle" },
    { route: "/profile", icon: "user" },
  ];

  const BAR_HEIGHT = 58;
  const SLOT_HEIGHT = 80;

  const onUniversalRatePress = () => {
    // ✅ open overlay, blank => will prompt search inside overlay
    openReview();
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT + (insets?.bottom || 0),
        backgroundColor: COLORS.screen,
        borderTopColor: COLORS.divider,
        borderTopWidth: 1,
        paddingTop: 6,
        paddingBottom: insets?.bottom > 0 ? insets.bottom / 2 : 6,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        {TABS.map((tab, index) => {
          const isActive =
            tab.route === "/"
              ? pathname === "/"
              : tab.route !== "__review_overlay__" && pathname.startsWith(tab.route);

          // ✅ Center "+" button
          if (tab.isCenter) {
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: SLOT_HEIGHT,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={onUniversalRatePress}
                  activeOpacity={0.85}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 65,
                    height: 40,
                    borderRadius: 25,
                    backgroundColor: COLORS.active,
                  }}
                >
                  <Feather name="plus" size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
            );
          }

          // ✅ Normal tabs
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (!isActive) router.push(tab.route);
              }}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 14, right: 14 }}
              style={{
                flex: 1,
                height: SLOT_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name={tab.icon}
                size={25}
                color={isActive ? COLORS.active : COLORS.subtext}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

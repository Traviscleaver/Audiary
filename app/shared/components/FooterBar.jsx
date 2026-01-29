/* 
Footer Bar

A fixed bottom navigation bar for the app. It reads the current route using `usePathname()`,
renders 5 tabs (Home, Search, Add, Activity, Profile), highlights the active tab, and uses
`router.replace()` to navigate without stacking routes. The center "Add" tab is a special
styled plus button.
*/


import { usePathname } from "expo-router";
import { COLORS, Feather, TouchableOpacity, View } from "../imports";

export default function FooterBar({ router, insets }) {
  const pathname = usePathname();

  const TABS = [
    { route: "/home", icon: "home" },
    { route: "/search", icon: "search" },
    { route: "/add", icon: "plus", isCenter: true },
    { route: "/activity", icon: "message-circle" },
    { route: "/profile", icon: "user" },
  ];

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 58 + (insets?.bottom || 0),
        backgroundColor: COLORS.navbar,
        paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 6,
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
          const isActive = pathname.startsWith(tab.route);

          // Special "plus" button in the center
          if (tab.isCenter) {
            return (
              <View key={index} style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => router.replace("/add")}
                  activeOpacity={0.8}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 22,
                    backgroundColor: COLORS.active,
                  }}
                >
                  <Feather name="plus" size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => !isActive && router.replace(tab.route)}
              disabled={isActive}
              style={{ flex: 1, alignItems: "center", opacity: isActive ? 1 : 1 }}
            >
              <Feather
                name={tab.icon}
                size={22}
                color={isActive ? COLORS.active : COLORS.subtext}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

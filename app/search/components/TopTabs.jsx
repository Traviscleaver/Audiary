import { COLORS, Text, TouchableOpacity, View, useEffect, useState } from "../../shared/imports";


export default function TopTabs({ activeTab, setActiveTab }) {
  const [tabsWidth, setTabsWidth] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const SEARCH_TABS = ["Music", "Reviews", "Lists", "Users"];

  useEffect(() => {
    if (!tabsWidth) return;
    const idx = Math.max(0, SEARCH_TABS.indexOf(activeTab));
    const slot = tabsWidth / SEARCH_TABS.length;
    setIndicator({ left: idx * slot, width: slot });
  }, [activeTab, tabsWidth]);

  return (
    <View style={{ backgroundColor: COLORS.navbar }}>
      <View
        onLayout={(e) => setTabsWidth(e.nativeEvent.layout.width)}
        style={{
          position: "relative",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 8,
          borderBottomColor: COLORS.divider,
          borderBottomWidth: 1,
        }}
      >
        {/* underline */}
        <View
          style={{
            position: "absolute",
            bottom: -1,
            left: indicator.left,
            width: indicator.width,
            height: 2,
            backgroundColor: COLORS.active,
          }}
        />

        {SEARCH_TABS.map((t) => {
          const active = activeTab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={{ paddingVertical: 12, flex: 1, alignItems: "center" }}
            >
              <Text
                style={{
                  color: active ? COLORS.text : COLORS.faint,
                  fontWeight: active ? "700" : "600",
                  fontSize: 16,
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

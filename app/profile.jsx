// screens/profile.jsx
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ===== Design tokens ===== */
const COLORS = {
  screen: "#121212",
  card: "#191919",
  text: "#ffffff",
  subtext: "#bfc6cf",
  divider: "#232323",
  active: "#1db954",
  gold: "#f5c518",
  button: "#2a2a2a",
  border: "rgba(255,255,255,0.22)",
};

const SIZES = {
  pad: 16,
  radius: 12,
  avatar: 72,
  album: 140,
  footerHeight: 58,

  // Slider card sizes
  cover: 104,
  coverRadius: 12,
  cardGap: 12,
  cardWidth: 104,
  titleTop: 8,
};

const TABS = ["Home", "Reviews", "Lists"];

/* Equal-size button dimensions */
const BUTTON_W = 90;
const BUTTON_H = 36;
const AVATAR_SCALE = 1.5;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [handle] = useState("user");
  const [displayName] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");

  const stats = useMemo(
    () => ({
      reviews: 2,
      followers: 2,
      ratings: 22,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
        {/* ===== Header ===== */}
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={styles.leftCol}>
              <View style={styles.avatar}>
                <Feather name="user" size={48} color={COLORS.subtext} />
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity activeOpacity={0.85} style={styles.equalBtn}>
                  <Text style={styles.equalBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.85} style={styles.equalBtn2}>
                  <Feather name="share-2" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rightCol}>
              <View style={styles.centeredRightBlock}>
                <Text numberOfLines={1} style={styles.nameBig}>
                  {handle ?? "your_handle"}
                </Text>

                {!!displayName && <Text style={styles.displayName}>{displayName}</Text>}

                <View style={styles.inlineRow}>
                  <InlineStat count={stats.followers} label="followers" />
                  <InlineStat count={stats.reviews} label="reviews" />
                  <InlineStat count={stats.ratings} label="ratings" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ===== Tabs ===== */}
        <View style={styles.tabsBar}>
          {TABS.map((t) => (
            <Tab key={t} label={t} active={activeTab === t} onPress={() => setActiveTab(t)} />
          ))}
        </View>

        {/* ===== Content ===== */}
        {activeTab === "Home" && (
          <>
            <Section title="Favourite Albums">
              <PlaceholderSlider type="album" count={10} />
            </Section>

            <Section title="Favourite Songs">
              <PlaceholderSlider type="song" count={12} />
            </Section>

            <Section title="Favourite Artists">
              <PlaceholderSlider type="artist" count={12} />
            </Section>

            {/* Added extra bottom margin here */}
            <Section title="Recent Activity" bottomMargin>
              <PlaceholderSlider type="activity" count={14} />
            </Section>
          </>
        )}

        {activeTab === "Reviews" && (
          <Section title="Reviews">
            <View style={styles.emptyWrap}>
              <Text style={styles.placeholderText}>No reviews yet.</Text>
            </View>
          </Section>
        )}

        {activeTab === "Lists" && (
          <Section title="Lists">
            <View style={styles.emptyWrap}>
              <Text style={styles.placeholderText}>No lists yet.</Text>
            </View>
          </Section>
        )}
      </ScrollView>

      <FooterBar router={router} insets={insets} />
    </SafeAreaView>
  );
}

/* ===== Inline small stat ===== */
function InlineStat({ count, label }) {
  return (
    <View style={styles.inlineGroup}>
      <Text style={styles.inlineCount}>{String(count)}</Text>
      <Text style={styles.inlineLabel}> {label}</Text>
    </View>
  );
}

/* ===== Horizontal placeholder slider (covers with title under) ===== */
const PlaceholderSlider = memo(function PlaceholderSlider({ count = 10, type = "album" }) {
  const items = Array.from({ length: count }).map((_, i) => ({
    id: `${type}-${i + 1}`,
    title:
      type === "album"
        ? `Album ${i + 1}`
        : type === "song"
        ? `Song ${i + 1}`
        : type === "artist"
        ? `Artist ${i + 1}`
        : `Item ${i + 1}`,
  }));

  const renderItem = ({ item }) => (
    <View style={styles.sliderItem}>
      <View
        style={[
          styles.cover,
          type === "artist" ? styles.coverCircle : null,
        ]}
      />
      <Text numberOfLines={1} style={styles.coverTitle}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      contentContainerStyle={styles.sliderContent}
      showsHorizontalScrollIndicator={false}
    />
  );
});

/* ===== Footer Bar ===== */
function FooterBar({ router, insets }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: (SIZES.footerHeight || 58) + (insets?.bottom || 0),
        backgroundColor: "#000000",
        paddingBottom: insets && insets.bottom > 0 ? insets.bottom / 2 : 6,
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
        <TouchableOpacity onPress={() => router.replace("/home")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="home" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/search")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="search" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 22,
              backgroundColor: COLORS.active,
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace("/activity")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="message-circle" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/profile")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="user" size={22} color={COLORS.active} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===== Small Components ===== */
const Tab = memo(function Tab({ label, active = false, onPress }) {
  return (
    <TouchableOpacity style={styles.tabWrap} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.tabPad}>
        <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>{label}</Text>
      </View>
      <View style={[styles.tabUnderline, active ? styles.tabUnderlineOn : null]} />
    </TouchableOpacity>
  );
});

const Section = ({ title, rightIcon, children, bottomMargin }) => (
  <View style={[styles.section, bottomMargin ? { marginBottom: 80 } : null]}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rightIcon}
    </View>
    {children}
  </View>
);

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.screen },
  screen: { flex: 1, backgroundColor: COLORS.screen },
  scrollContent: { paddingBottom: 10 },

  headerWrap: { paddingHorizontal: SIZES.pad, paddingTop: SIZES.pad + 2 },
  headerRow: { flexDirection: "row", alignItems: "flex-start" },
  leftCol: { width: SIZES.avatar * AVATAR_SCALE + 10, marginRight: 12, alignItems: "center" },
  avatar: {
    width: SIZES.avatar * AVATAR_SCALE,
    height: SIZES.avatar * AVATAR_SCALE,
    borderRadius: (SIZES.avatar * AVATAR_SCALE) / 2,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionsRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  equalBtn: {
    marginTop: 10,
    marginLeft: 50,
    width: BUTTON_W,
    height: BUTTON_H,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  equalBtn2: { marginTop: 10, width: 40, height: BUTTON_H, alignItems: "center", justifyContent: "center" },
  equalBtnText: { color: COLORS.text, fontSize: 16, fontWeight: "700" },

  rightCol: { flex: 1, justifyContent: "center" },
  centeredRightBlock: { justifyContent: "center", height: SIZES.avatar * AVATAR_SCALE },
  nameBig: { color: COLORS.text, fontSize: 30, fontWeight: "800", lineHeight: 34, marginBottom: 2 },
  displayName: { color: COLORS.subtext, fontSize: 14, marginTop: 2 },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 4 },
  inlineGroup: { flexDirection: "row", alignItems: "center" },
  inlineCount: { color: COLORS.text, fontSize: 14, fontWeight: "800" },
  inlineLabel: { color: COLORS.subtext, fontSize: 13, fontWeight: "500" },

  tabsBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: "row",
    paddingHorizontal: SIZES.pad,
    marginTop: 12,
  },
  tabWrap: { flex: 1, alignItems: "center" },
  tabPad: { paddingVertical: 12 },
  tabText: { color: COLORS.subtext, fontWeight: "600", fontSize: 14 },
  tabTextActive: { color: COLORS.text, fontWeight: "700" },
  tabUnderline: { height: 2, width: "100%", borderRadius: 2, backgroundColor: "transparent" },
  tabUnderlineOn: { backgroundColor: COLORS.active },

  section: { marginTop: 18 },
  sectionHeader: {
    paddingHorizontal: SIZES.pad,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  emptyWrap: { paddingHorizontal: SIZES.pad, paddingVertical: 20 },
  placeholderText: { color: COLORS.subtext },

  sliderContent: { paddingHorizontal: SIZES.pad },
  sliderItem: { width: SIZES.cardWidth, marginRight: SIZES.cardGap },
  cover: {
    width: SIZES.cover,
    height: SIZES.cover,
    borderRadius: SIZES.coverRadius,
    backgroundColor: COLORS.card,
  },
  coverCircle: { borderRadius: SIZES.cover / 2 },
  coverTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: SIZES.titleTop,
  },
});

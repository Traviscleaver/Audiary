// screens/profile.jsx
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
  memo,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ===== Theme ===== */
const COLORS = {
  screen: "#121212",
  card: "#191919",
  text: "#ffffff",
  subtext: "#bfc6cf",
  divider: "#232323",
  active: "#1db954",
  danger: "#ff5757",
  faint: "#ffffff60",
};

const SIZES = {
  pad: 16,
  radius: 12,
  avatar: 72,
  footerHeight: 58,

  cover: 104,
  coverRadius: 12,
  cardGap: 12,
  cardWidth: 104,
};

const TABS = ["Home", "Reviews", "Lists"];
const AVATAR_SCALE = 1.5;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [handle, setHandle] = useState("user123");
  const [givenName, setGivenName] = useState("Travis");
  const [familyName, setFamilyName] = useState("Cleaver");
  const [email, setEmail] = useState("travis@example.com");
  const [location, setLocation] = useState("Vancouver BC");
  const [website, setWebsite] = useState("");
  const [pronoun, setPronoun] = useState("He / his");
  const [activeTab, setActiveTab] = useState("Home");

  const stats = useMemo(
    () => ({
      reviews: 2,
      followers: 2,
      ratings: 22,
    }),
    []
  );

  /* ========== SETTINGS OVERLAY ========== */
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bioOverlayOpen, setBioOverlayOpen] = useState(false);
  const [emailOverlayOpen, setEmailOverlayOpen] = useState(false);

  const settingsAnim = useRef(new Animated.Value(0)).current;

  const openSettings = () => {
    setSettingsOpen(true);
    Animated.timing(settingsAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(settingsAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setSettingsOpen(false));
  };

  /* ========== SUB OVERLAYS ========== */
  const subAnim = useRef(new Animated.Value(0)).current;

  const openBioOverlay = () => {
    setBioOverlayOpen(true);
    Animated.timing(subAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeBioOverlay = () => {
    Animated.timing(subAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setBioOverlayOpen(false));
  };

  const openEmailOverlay = () => {
    setEmailOverlayOpen(true);
    Animated.timing(subAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeEmailOverlay = () => {
    Animated.timing(subAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setEmailOverlayOpen(false));
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 0 }]}>
      {/* === MAIN PROFILE (UNCHANGED) === */}
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>

        <View style={[styles.topRightActions, { top: insets.top + 4}]}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="share-2" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={openSettings}>
            <Feather name="more-horizontal" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={styles.leftCol}>
              <View style={styles.avatar}>
                <Feather name="user" size={48} color={COLORS.subtext} />
              </View>
            </View>

            <View style={styles.rightCol}>
              <View style={styles.centeredRightBlock}>
                <Text style={styles.nameBig}>{handle}</Text>

                <View style={styles.inlineRow}>
                  <InlineStat count={stats.followers} label="followers" />
                  <InlineStat count={stats.reviews} label="reviews" />
                  <InlineStat count={stats.ratings} label="ratings" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabsBar}>
          {TABS.map((t) => (
            <Tab key={t} label={t} active={activeTab === t} onPress={() => setActiveTab(t)} />
          ))}
        </View>

        {/* CONTENT */}
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

      {/* ======================================================
                       SETTINGS OVERLAY
         ====================================================== */}
      {settingsOpen && (
        <Animated.View style={[styles.settingsOverlay, { opacity: settingsAnim }]}>
          <TouchableOpacity
            onPress={closeSettings}
            style={styles.overlayBackground}
            activeOpacity={1}
          />

          <Animated.View
            style={[
              styles.settingsSheet,
              {
                /* UPDATED: Overlay now 92% height */
                height: "92%",
                transform: [
                  {
                    translateY: settingsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [700, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* HEADER */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={closeSettings}>
                <Text style={styles.sheetCancel}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.sheetTitle}>Settings</Text>

              <TouchableOpacity onPress={closeSettings}>
                <Text style={styles.sheetSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>

              {/* ACCOUNT */}
              <Text style={styles.smallHeader}>ACCOUNT</Text>

              {/* USERNAME */}
              <View style={styles.rowEditable}>
                <Text style={styles.editLabel}>Username</Text>
                <TextInput
                  value={handle}
                  onChangeText={setHandle}
                  placeholder="Username"
                  placeholderTextColor={COLORS.faint}
                  style={styles.editInput}
                  maxLength={36}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>

              {/* PASSWORD & AUTH */}
              <TouchableOpacity style={styles.rowTouchable}>
                <Text style={styles.editLabel}>Password and authentication</Text>
                <Feather name="chevron-right" size={18} color={COLORS.subtext} />
              </TouchableOpacity>

              {/* SIGN OUT */}
              <TouchableOpacity style={styles.rowTouchable}>
                <Text style={[styles.editLabel, { color: COLORS.danger }]}>Sign out</Text>
              </TouchableOpacity>

              {/* PROFILE */}
              <Text style={styles.smallHeader}>PROFILE</Text>

              {/* GIVEN */}
              <View style={styles.rowEditable}>
                <Text style={styles.editLabel}>Given name</Text>
                <TextInput
                  value={givenName}
                  onChangeText={setGivenName}
                  placeholder="Given name"
                  placeholderTextColor={COLORS.faint}
                  style={styles.editInput}
                />
              </View>

              {/* FAMILY */}
              <View style={styles.rowEditable}>
                <Text style={styles.editLabel}>Family name</Text>
                <TextInput
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholder="Family name"
                  placeholderTextColor={COLORS.faint}
                  style={styles.editInput}
                />
              </View>

              {/* EMAIL */}
              <TouchableOpacity style={styles.rowTouchable} onPress={openEmailOverlay}>
                <Text style={styles.editLabel}>Email address</Text>
                <View style={styles.rightInline}>
                  <Text
                    style={styles.editValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {email}
                  </Text>
                  <Feather name="chevron-right" size={18} color={COLORS.subtext} />
                </View>
              </TouchableOpacity>

              {/* LOCATION */}
              <View style={styles.rowEditable}>
                <Text style={styles.editLabel}>Location</Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Location"
                  placeholderTextColor={COLORS.faint}
                  style={styles.editInput}
                />
              </View>

              {/* WEBSITE */}
              <View style={styles.rowEditable}>
                <Text style={styles.editLabel}>Website</Text>
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="Website"
                  placeholderTextColor={COLORS.faint}
                  style={styles.editInput}
                />
              </View>

              {/* BIO */}
              <TouchableOpacity style={styles.rowTouchable} onPress={openBioOverlay}>
                <Text style={styles.editLabel}>Bio</Text>
                <Feather name="chevron-right" size={18} color={COLORS.subtext} />
              </TouchableOpacity>

              {/* PRONOUN */}
              <TouchableOpacity style={styles.rowTouchable}>
                <Text style={styles.editLabel}>Pronoun</Text>
                <View style={styles.rightInline}>
                  <Text
                    style={styles.editValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {pronoun}
                  </Text>
                  <Feather name="chevron-right" size={18} color={COLORS.subtext} />
                </View>
              </TouchableOpacity>

              <View style={{ height: 80 }} />
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}

      {/* ======================================================
                 SUB OVERLAY — BIO
         ====================================================== */}
      {bioOverlayOpen && (
        <Animated.View style={[styles.settingsOverlay, { opacity: subAnim }]}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={closeBioOverlay}
          />
          <Animated.View
            style={[
              styles.subSheet,
              {
                transform: [
                  {
                    translateY: subAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={closeBioOverlay}>
                <Text style={styles.sheetCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Bio</Text>
              <TouchableOpacity onPress={closeBioOverlay}>
                <Text style={styles.sheetSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              <TextInput
                multiline
                placeholder="Write something..."
                placeholderTextColor={COLORS.subtext}
                style={styles.bioInput}
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* ======================================================
                 SUB OVERLAY — EMAIL
         ====================================================== */}
      {emailOverlayOpen && (
        <Animated.View style={[styles.settingsOverlay, { opacity: subAnim }]}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={closeEmailOverlay}
          />
          <Animated.View
            style={[
              styles.subSheet,
              {
                transform: [
                  {
                    translateY: subAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={closeEmailOverlay}>
                <Text style={styles.sheetCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Email</Text>
              <TouchableOpacity onPress={closeEmailOverlay}>
                <Text style={styles.sheetSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingLeft:15,paddingTop:0 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={COLORS.subtext}
                style={[
                  styles.bioInput,
                  { minHeight: 50 } // same touch height as others
                ]}
                autoCapitalize="none"
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

/* COMPONENTS — unchanged */
function InlineStat({ count, label }) {
  return (
    <View style={styles.inlineGroup}>
      <Text style={styles.inlineCount}>{count}</Text>
      <Text style={styles.inlineLabel}>{label}</Text>
    </View>
  );
}

const PlaceholderSlider = memo(function Slider({ count, type }) {
  const arr = Array.from({ length: count }).map((_, i) => ({
    id: `${type}-${i}`,
    title: `${type} ${i + 1}`,
  }));

  return (
    <FlatList
      horizontal
      data={arr}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={styles.sliderItem}>
          <View style={styles.cover} />
          <Text style={styles.coverTitle}>{item.title}</Text>
        </View>
      )}
      contentContainerStyle={styles.sliderContent}
      showsHorizontalScrollIndicator={false}
    />
  );
});

function FooterBar({ router, insets }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 58 + insets.bottom,
        backgroundColor: "#000",
        paddingBottom: insets.bottom / 2,
      }}
    >
      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => router.replace("/home")} style={styles.footerBtn}>
          <Feather name="home" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/search")} style={styles.footerBtn}>
          <Feather name="search" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <View style={styles.footerBtn}>
          <TouchableOpacity style={styles.fab}>
            <Feather name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace("/activity")} style={styles.footerBtn}>
          <Feather name="message-circle" size={22} color={COLORS.subtext} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/profile")} style={styles.footerBtn}>
          <Feather name="user" size={22} color={COLORS.active} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Tab = memo(function Tab({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tabWrap} onPress={onPress}>
      <View style={styles.tabPad}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>
          {label}
        </Text>
      </View>
      <View style={[styles.tabUnderline, active && styles.tabUnderlineOn]} />
    </TouchableOpacity>
  );
});

const Section = ({ title, children, bottomMargin }) => (
  <View style={[styles.section, bottomMargin && { marginBottom: 80 }]}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.screen },
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  topRightActions: {
  flexDirection: "row",
  gap: 14,
  alignSelf: "flex-end",
  marginRight: 16,
  marginTop: 6,
},

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: COLORS.screen,
    alignItems: "center",
    justifyContent: "center",
  },

  headerWrap: { paddingHorizontal: SIZES.pad, paddingTop: SIZES.pad + 30 },
  headerRow: { flexDirection: "row" },
  leftCol: { width: SIZES.avatar * AVATAR_SCALE + 10, marginRight: 12 },
  avatar: {
    width: SIZES.avatar * AVATAR_SCALE,
    height: SIZES.avatar * AVATAR_SCALE,
    borderRadius: (SIZES.avatar * AVATAR_SCALE) / 2,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },

  rightCol: { flex: 1 },
  centeredRightBlock: {
    justifyContent: "center",
    height: SIZES.avatar * AVATAR_SCALE,
  },
  nameBig: { color: COLORS.text, fontSize: 30, fontWeight: "800" },

  inlineRow: { flexDirection: "row", gap: 22, marginTop: 8 },
  inlineGroup: { alignItems: "center", minWidth: 60 },
  inlineCount: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  inlineLabel: { color: COLORS.subtext, fontSize: 13 },

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
  tabText: { color: COLORS.subtext, fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: COLORS.text, fontWeight: "700" },
  tabUnderline: { height: 2, width: "100%", backgroundColor: "transparent" },
  tabUnderlineOn: { backgroundColor: COLORS.active },

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
  coverTitle: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 8,
    fontWeight: "700",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    height: "100%",
  },
  footerBtn: { flex: 1, alignItems: "center" },

  fab: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ========== SETTINGS ========== */

  settingsOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 3000,
  },
  overlayBackground: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  },

  settingsSheet: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sheetCancel: { color: COLORS.subtext, fontSize: 16 },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  sheetSave: { color: COLORS.active, fontSize: 16, fontWeight: "700" },

  smallHeader: {
    fontSize: 13,
    color: COLORS.subtext,
    marginLeft: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  

  rowEditable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editLabel: {
    color: COLORS.text,
    fontSize: 16,
  },

  editInput: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "right",
    padding: 0,
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

  rightInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  /* SUB-SHEETS */
  subSheet: {
    height: "60%",
    width: "100%",
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  bioInput: {
    width: "100%",
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 8,
  },
});


import {
  COLORS,
  Dimensions,
  Feather,
  SafeAreaView,
  ScrollView,
  SIZES,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useRouter,

  useSafeAreaInsets,
  useState,
  View,
} from "./shared/imports";



export default function Activity() {
  const [activeTab, setActiveTab] = useState("Messages");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const screenWidth = Dimensions.get("window").width;
  const underlineWidth = screenWidth / 2;
  const underlineLeft = activeTab === "Messages" ? 0 : underlineWidth;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background for notch/status area */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: COLORS.navbar,
          zIndex: 0,
        }}
        pointerEvents="none"
      />

      {/* ===== Top Navbar ===== */}
      <View style={[styles.navbarWrap, { paddingTop: insets.top }]}>
        <View style={styles.navbarInner}>
          <TouchableOpacity
            onPress={() => setActiveTab("Messages")}
            style={styles.navItem}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navText,
                activeTab === "Messages" && styles.navTextActive,
              ]}
            >
              Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Activity")}
            style={styles.navItem}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navText,
                activeTab === "Activity" && styles.navTextActive,
              ]}
            >
              Activity
            </Text>
          </TouchableOpacity>
        </View>

        {/* Underline indicator across 50% width (no animation) */}
        <View
          style={[
            styles.underline,
            {
              width: underlineWidth,
              left: underlineLeft,
            },
          ]}
        />
      </View>

      {/* ===== Content ===== */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: SIZES.footerHeight + (insets.bottom || 0) + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Messages" ? (
          <View style={styles.centerWrap}>
            <Text style={styles.inviteText}>
              Share your favorite music with friends on Audiary, or start a new chat to connect with other members.
            </Text>

            <TouchableOpacity style={styles.inviteButton} activeOpacity={0.9}>
              <Text style={styles.inviteButtonText}>Invite Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.startChatText}>Start a new chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.centerWrap}>
            <Text style={styles.subtext}>Activity tab coming soon...</Text>
          </View>
        )}
      </ScrollView>

      <FooterBar router={router} insets={insets} />
    </SafeAreaView>
  );
}

/* ===== Footer Bar ===== */
function FooterBar({ router, insets }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: SIZES.footerHeight + (insets?.bottom || 0),
        backgroundColor: COLORS.navbar,
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

        <TouchableOpacity onPress={() => router.replace("")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="message-circle" size={22} color={COLORS.active} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/profile")} style={{ flex: 1, alignItems: "center" }}>
          <Feather name="user" size={22} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },

  navbarWrap: {
    backgroundColor: COLORS.navbar,
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
    color: COLORS.buttonText,
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

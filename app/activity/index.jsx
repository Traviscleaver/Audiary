import {
  COLORS,
  Dimensions,
  SafeAreaView,
  ScrollView,
  SIZES,
  StatusBar,
  Text,
  TouchableOpacity,
  useRouter,

  useSafeAreaInsets,
  useState,
  View
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar";
import { styles } from "./styles/styles";

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
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.navItem,
              { flex: 1, alignItems: "center", justifyContent: "center" }, // ✅ full half
            ]}
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
            onPress={() => setActiveTab("Community")}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.navItem,
              { flex: 1, alignItems: "center", justifyContent: "center" }, // ✅ full half
            ]}
          >
            <Text
              style={[
                styles.navText,
                activeTab === "Community" && styles.navTextActive,
              ]}
            >
              Community
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
            <Text style={styles.subtext}>Communities Coming Soon!</Text>
          </View>
        )}
      </ScrollView>

      <FooterBar router={router} insets={insets} />
    </SafeAreaView>
  );
}

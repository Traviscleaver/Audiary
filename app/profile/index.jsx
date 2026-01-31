// profile.jsx
import useProfileOverlays from "./hooks/useProfileOverlays";
import useProfileData from "./hooks/useProfileData";

import {
  Animated,
  COLORS,
  Feather,
  FlatList,
  Image,
  SIZES,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  memo,
  useEffect,
  useRef,
  useRouter,
  useSafeAreaInsets,
  useState
} from "../shared/imports";

import FooterBar from "../shared/components/FooterBar.jsx";
import FavoriteItemCard from "./components/FavoriteItemCard.jsx";
import BioOverlay from "./components/BioOverlay.jsx";
import EmailOverlay from "./components/EmailOverlay.jsx";
import SettingsOverlay from "./components/SettingsOverlay.jsx";


const TABS = ["Home", "Reviews", "Lists"];
const AVATAR_SCALE = 1.5;

export default function Profile() {


  const {
    status,
    profile,
    loadingExtra,
    stats,
    favourites,
    playlists,
    reviews,
    ratings,
    diary,
    activity,
  } = useProfileData();

  const router = useRouter();
  const insets = useSafeAreaInsets();


  // ===== USER STATE =====
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [pronoun, setPronoun] = useState("He / his");

  // const [loadingExtra, setLoadingExtra] = useState(false);
  
  // For your Settings UI
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");

  const [activeTab, setActiveTab] = useState("Home");

  const showFavPlaceholders = loadingExtra && favourites.length === 0;



  const {
    settingsOpen,
    bioOverlayOpen,
    emailOverlayOpen,
    settingsAnim,
    subAnim,
    openSettings,
    closeSettings,
    openBioOverlay,
    closeBioOverlay,
    openEmailOverlay,
    closeEmailOverlay,
  } = useProfileOverlays();






  // ===== Hydrate local UI fields from profile (when profile changes) =====
  useEffect(() => {
    if (!profile) return;

    setHandle(profile.username || "");
    setEmail(profile.email || "");
    setDisplayName(profile.display_name || "");
    setBio(profile.bio || "");
    setAvatarUrl(profile.avatar_url || "");
    setLocation(profile.location || "");
    setWebsite(profile.website || "");

    if (profile.display_name) {
      const parts = profile.display_name.trim().split(/\s+/);
      setGivenName(parts[0] || "");
      setFamilyName(parts.slice(1).join(" ") || "");
    } else {
      setGivenName("");
      setFamilyName("");
    }

  }, [profile]);

  const [favouriteAlbums, setFavouriteAlbums] = useState([]);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [favouriteArtists, setFavouriteArtists] = useState([]);

  // Filtered favorites
  useEffect(() => {
    setFavouriteAlbums(favourites.filter(f => f.item_type === "album"));
    setFavouriteSongs(favourites.filter(f => f.item_type === "song"));
    setFavouriteArtists(favourites.filter(f => f.item_type === "artist"));
    // setLoadingExtra(false);
  } , [favourites]);


  if (status !== "logged-in") return <Text>Please log in.</Text>;

  // Only block if we don't have profile yet
  if (!profile) return <Text>Loading profile...</Text>;


  const PlaceholderSlider = memo(function PlaceholderSlider({ count, type }) {
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: `${type}-${i}`,
    }));

    return (
      <FlatList
        horizontal
        data={arr}
        keyExtractor={(i) => i.id}
        renderItem={() => (
          <View style={styles.sliderItem}>
            <View style={styles.cover} />
            <View style={{ height: 10 }} />
            <View style={styles.placeholderLine} />
          </View>
        )}
        contentContainerStyle={styles.sliderContent}
        showsHorizontalScrollIndicator={false}
      />
    );
  });

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 0 }]}>

      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.topRightActions, { top: insets.top + 4 }]}>

          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="share-2" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={openSettings}>
            <Feather name="more-horizontal" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* HEADER */}
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={styles.leftCol}>
              <View style={styles.avatar}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 999,
                    }}
                  />
                ) : (
                  <Feather name="user" size={48} color={COLORS.subtext} />
                )}
              </View>
            </View>

            <View style={styles.rightCol}>
              <View style={styles.centeredRightBlock}>
                <Text style={styles.nameBig}>
                  {displayName || handle || "User"}
                </Text>

                <View style={styles.inlineRow}>
                  <InlineStat count={stats.total_reviews || 0} label="reviews" />
                  <InlineStat count={stats.total_ratings || 0} label="ratings" />
                  <InlineStat count={stats.total_songs_listened || 0} label="listens" />
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


        {activeTab === "Home" && (
          <>
            {/* FAVORITE ALBUMS */}
            <Section title="Favourite Albums">
              {loadingExtra ? (
                <PlaceholderSlider type="album" count={10} />
              ) : (
                <FlatList
                  horizontal
                  data={favouriteAlbums}
                  keyExtractor={(i) => `${i.item_type}-${i.item_id}`}
                  renderItem={({ item }) => <FavoriteItemCard type="album" id={item.item_id} />}
                  contentContainerStyle={styles.sliderContent}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </Section>


            {/* FAVORITE SONGS */}
            <Section title="Favourite Songs">
              {loadingExtra ? (
                <PlaceholderSlider type="album" count={10} />
              ) : (
              <FlatList
                horizontal
                data={favouriteSongs}
                keyExtractor={(i) => `${i.item_type}-${i.item_id}`}
                renderItem={({ item }) => (
                  <FavoriteItemCard type="song" id={item.item_id} />
                )}
                contentContainerStyle={styles.sliderContent}
                showsHorizontalScrollIndicator={false}
              />
              )}
            </Section>

            {/* FAVORITE ARTISTS */}
            <Section title="Favourite Artists">
              {loadingExtra ? (
                <PlaceholderSlider type="album" count={10} />
              ) : (
              <FlatList
                horizontal
                data={favouriteArtists}
                keyExtractor={(i) => `${i.item_type}-${i.item_id}`}
                renderItem={({ item }) => (
                  <FavoriteItemCard type="artist" id={item.item_id} />
                )}
                contentContainerStyle={styles.sliderContent}
                showsHorizontalScrollIndicator={false}
              />
              )}
            </Section>

            {/* RECENT ACTIVITY */}
            <Section title="Recent Activity" bottomMargin>
              {activity.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Text style={styles.placeholderText}>No activity yet.</Text>
                </View>
              ) : (
                activity.map((a) => (
                  <View key={a.activity_id} style={{ padding: 12 }}>
                    <Text style={{ color: COLORS.text }}>
                      {a.type} → {a.description}
                    </Text>
                    <Text style={{ color: COLORS.subtext, fontSize: 12 }}>
                      {new Date(a.created_at).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </Section>
          </>
        )}


        {/* {activeTab === "Reviews" && (
          <Section title="Reviews">
            <View style={styles.emptyWrap}>
              <Text style={styles.placeholderText}>No reviews yet.</Text>
            </View>
          </Section>
        )} */}
        {activeTab === "Reviews" && (
          <Section title="Reviews">
            {reviews.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.placeholderText}>No reviews yet.</Text>
              </View>
            ) : (
              reviews.map((r) => (
                <View key={r.review_id} style={{ padding: 12 }}>
                  <Text style={{ color: COLORS.text, fontWeight: "700" }}>
                    {r.song_title}
                  </Text>
                  <Text style={{ color: COLORS.active, marginTop: 4 }}>
                    ★ {r.rating}
                  </Text>
                  <Text style={{ color: COLORS.text, marginTop: 6 }}>
                    {r.content}
                  </Text>
                </View>
              ))
            )}
          </Section>
        )}


        {/* {activeTab === "Lists" && (
          <Section title="Lists">
            <View style={styles.emptyWrap}>
              <Text style={styles.placeholderText}>No lists yet.</Text>
            </View>
          </Section>
        )} */}
        {activeTab === "Lists" && (
          <Section title="Lists">
            {playlists.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.placeholderText}>No playlists yet.</Text>
              </View>
            ) : (
              playlists.map((p) => (
                <View key={p.playlist_id} style={{ padding: 14 }}>
                  <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "800" }}>
                    {p.title}
                  </Text>
                  <Text style={{ color: COLORS.subtext }}>
                    {p.song_count} songs
                  </Text>
                </View>
              ))
            )}
          </Section>
        )}

      </ScrollView>

      <FooterBar router={router} insets={insets} />

      {/* ======= SETTINGS OVERLAY ======= */}
      {settingsOpen && (
        <SettingsOverlay
          settingsAnim={settingsAnim}
          closeSettings={closeSettings}

          handle={handle}
          setHandle={setHandle}

          givenName={givenName}
          setGivenName={setGivenName}
          familyName={familyName}
          setFamilyName={setFamilyName}

          email={email}

          location={location}
          setLocation={setLocation}
          website={website}
          setWebsite={setWebsite}
          pronoun={pronoun}

          openBioOverlay={openBioOverlay}
          openEmailOverlay={openEmailOverlay}

          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}

          onSave={(user) => {
            setHandle(user.username);
            setEmail(user.email);
            setDisplayName(user.display_name || "");
            setBio(user.bio || "");
            setAvatarUrl(user.avatar_url || "");
          }}
        />
      )}

      {bioOverlayOpen && (
        <BioOverlay subAnim={subAnim} closeBioOverlay={closeBioOverlay} bio={bio} setBio={setBio} />
      )}

      {emailOverlayOpen && (
        <EmailOverlay
          subAnim={subAnim}
          closeEmailOverlay={closeEmailOverlay}
          email={email}
          setEmail={setEmail}
        />
      )}
    </SafeAreaView>
  );
}

/* ===================================================================
   SMALL COMPONENTS
   =================================================================== */

function InlineStat({ count, label }) {
  return (
    <View style={styles.inlineGroup}>
      <Text style={styles.inlineCount}>{count}</Text>
      <Text style={styles.inlineLabel}>{label}</Text>
    </View>
  );
}
// function FavoriteItemCard({ type, id }) {
//   return (
//     <View style={styles.sliderItem}>
//       <View style={styles.cover} />
//       <Text style={styles.coverTitle}>
//         {type} {id}
//       </Text>
//     </View>
//   );
// }




const Tab = memo(function Tab({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tabWrap} onPress={onPress}>
      <View style={styles.tabPad}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
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

/* ===================================================================
   STYLES (UNCHANGED)
   =================================================================== */

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
    overflow: "hidden",
  },

  rightCol: { flex: 1 },
  centeredRightBlock: { justifyContent: "center", height: SIZES.avatar * AVATAR_SCALE },
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

  // placeholderLine: {
  //   height: 10,
  //   borderRadius: 6,
  //   backgroundColor: COLORS.card, // or COLORS.divider if you have it
  //   opacity: 0.7,
  //   width: "80%",
  // },

});

// app/profile/index.jsx
import useFavouriteData from "./hooks/useFavouriteData";
import useProfileData from "./hooks/useProfileData";
import useProfileOverlays from "./hooks/useProfileOverlays";

import * as SecureStore from "expo-secure-store";
import { Animated, Platform, RefreshControl } from "react-native";

import {
  COLORS,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useEffect,
  useRouter,
  useSafeAreaInsets,
  useState,
} from "../shared/imports";

import { styles } from "./styles/styles";

import AuthGate from "../shared/components/AuthGate.jsx";
import FooterBar from "../shared/components/FooterBar.jsx";
import CreateOverlay from "./components/CreateOverlay.jsx";

// existing components
import PlaceholderSlider from "./components/PlaceholderSlider.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileSection from "./components/ProfileSection.jsx";
import ProfileTabsBar from "./components/ProfileTabsBar.jsx";
import ProfileTopBar from "./components/ProfileTopBar.jsx";
import SettingsOverlay from "./components/settings/SettingsOverlay.jsx";

// favourites layout
import FavouritesRow3 from "./components/favourites/FavouritesRow3.jsx";

// overlays
import FavouritesEditOverlay from "./components/overlays/FavouritesEditOverlay.jsx";
import FavouritesSearchOverlay from "./components/overlays/FavouritesSearchOverlay.jsx";
import ProfileSectionsOverlay from "./components/overlays/ProfileSectionsOverlay.jsx";

// api
import {
  removeFavourite,
  getMyProfileBlocks,
  createProfileBlock,
  reorderProfileBlocks,
  setProfileBlockDisplay
} from "../../lib/api.js";


const TABS = ["Home", "Reviews", "Lists"];

// Keeping your old local hide for now (later you can switch to server display toggle)
const HIDE_KEY = (userId) => `profile_hidden_fav_sections_v1_${userId}`;



async function getPersisted(key) {
  if (Platform.OS === "web") return localStorage.getItem(key);
  return await SecureStore.getItemAsync(key);
}
async function setPersisted(key, value) {
  if (Platform.OS === "web") {
    if (!value) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return;
  }
  if (!value) await SecureStore.deleteItemAsync(key);
  else await SecureStore.setItemAsync(key, value);
}
function safeParse(str) {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export default function Profile() {
  const {
    status,
    profile,
    loadingExtra,
    stats,
    playlists,
    reviews,
    ratings,
    diary,
    activity,
  } = useProfileData();

  const {
    favourites,
    loadingFavourites,
    refresh: refreshFavourites,
    setFavourites,
  } = useFavouriteData();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const insetsTop = insets.top;

  const isGuest = status !== "logged-in";
  const userId = profile?.user_id || null;

  // ===== USER STATE =====
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [pronoun, setPronoun] = useState("He / his");

  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");

  const [activeTab, setActiveTab] = useState("Home");
  const [blocksReady, setBlocksReady] = useState(false);

  const {
    settingsOpen,
    settingsAnim,
    openSettings,
    closeSettings,
    openBioOverlay,
    openEmailOverlay,
  } = useProfileOverlays();

  // ===== Create overlay =====
  const [createOpen, setCreateOpen] = useState(false);
  const createAnim = useState(() => new Animated.Value(0))[0];

  const openCreate = () => {
    setCreateOpen(true);
    createAnim.setValue(0);
    Animated.timing(createAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeCreate = () => {
    Animated.timing(createAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setCreateOpen(false);
    });
  };

  // ===== Hydrate local UI fields from profile =====
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

  // =========================================================
  // Sticky-then-hide Top Bar
  // =========================================================
  const TOPBAR_ROW_HEIGHT = 46;
  const TOPBAR_PADDING_TOP = insets.top + 6;
  const TOPBAR_TOTAL_HEIGHT = TOPBAR_PADDING_TOP + TOPBAR_ROW_HEIGHT;

  const STICKY_DELAY_PX = 45;
  const HIDE_DISTANCE = TOPBAR_TOTAL_HEIGHT;

  const scrollY = useState(() => new Animated.Value(0))[0];

  const topBarTranslateY = scrollY.interpolate({
    inputRange: [0, STICKY_DELAY_PX, STICKY_DELAY_PX + HIDE_DISTANCE],
    outputRange: [0, 0, -HIDE_DISTANCE],
    extrapolate: "clamp",
  });

  // ✅ Search + Edit overlay state
  const [favSearchOpen, setFavSearchOpen] = useState(false);
  const [favEditOpen, setFavEditOpen] = useState(false);
  const [favOverlayTitle, setFavOverlayTitle] = useState("");
  const [editingKey, setEditingKey] = useState(null); // "album" | "song" | "artist"

  const openSearchOverlay = (label) => {
    setFavOverlayTitle(label);
    setFavSearchOpen(true);
  };

  const openEditOverlay = (label, key) => {
    setFavOverlayTitle(label);
    setEditingKey(key);
    setFavEditOpen(true);
  };

  // ✅ Customize overlay
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // ✅ Hide sections state (persisted) — keeping for now
  const [hiddenFavSections, setHiddenFavSections] = useState({
    album: false,
    song: false,
    artist: false,
  });

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const raw = await getPersisted(HIDE_KEY(userId));
      const parsed = safeParse(raw);
      if (parsed && typeof parsed === "object") {
        setHiddenFavSections((prev) => ({ ...prev, ...parsed }));
      }
    })();
  }, [userId]);

  const setHidden = async (key, nextHidden) => {
    const next = { ...hiddenFavSections, [key]: nextHidden };
    setHiddenFavSections(next);
    if (userId) await setPersisted(HIDE_KEY(userId), JSON.stringify(next));
  };

  // =========================================================
  // ✅ Profile blocks (auto-create defaults if empty)
  // =========================================================
  const [profileBlocks, setProfileBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const refreshBlocks = async () => {
    if (isGuest) {
      setProfileBlocks([]);
      setBlocksReady(true);
      return;
    }

    try {
      setLoadingBlocks(true);
      setBlocksReady(false);

      const first = await getMyProfileBlocks();
      const blocks1 = first?.blocks || [];

      if (blocks1.length > 0) {
        setProfileBlocks(blocks1);
        return;
      }

      await createProfileBlock({ block_type: "favorites", subtype: "Albums" });
      await createProfileBlock({ block_type: "favorites", subtype: "Tracks" });
      await createProfileBlock({ block_type: "favorites", subtype: "Artists" });

      const second = await getMyProfileBlocks();
      setProfileBlocks(second?.blocks || []);
    } catch {
      setProfileBlocks([]);
    } finally {
      setLoadingBlocks(false);
      setBlocksReady(true);
    }
  };

  useEffect(() => {
    refreshBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest]);

  // =========================================================
  // ✅ Categorize favourites (rank-aware; respects item display)
  // =========================================================
  const [favouriteAlbums, setFavouriteAlbums] = useState([]);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [favouriteArtists, setFavouriteArtists] = useState([]);

  useEffect(() => {
    const byRank = (a, b) => {
      const ra = a.rank ?? 999;
      const rb = b.rank ?? 999;
      if (ra !== rb) return ra - rb;
      return 0;
    };

    setFavouriteAlbums(
      favourites
        .filter((f) => f.item_type === "album" && f.display !== false)
        .sort(byRank)
        .slice(0, 3)
    );

    setFavouriteSongs(
      favourites
        .filter((f) => f.item_type === "song" && f.display !== false)
        .sort(byRank)
        .slice(0, 3)
    );

    setFavouriteArtists(
      favourites
        .filter((f) => f.item_type === "artist" && f.display !== false)
        .sort(byRank)
        .slice(0, 3)
    );
  }, [favourites]);

  const showFavLoading =
    (loadingFavourites || loadingExtra) && favourites.length === 0;

  const usernameTitle = isGuest ? "Guest" : handle || "User";

  const editItems =
    editingKey === "album"
      ? favouriteAlbums
      : editingKey === "song"
      ? favouriteSongs
      : editingKey === "artist"
      ? favouriteArtists
      : [];

  const handleRemoveFavourite = async (favItem) => {
    const typeMap = { album: "Albums", song: "Tracks", artist: "Artists" };
    const uiType = typeMap[favItem.item_type];
    if (!uiType) return;

    setFavourites((prev) =>
      prev.filter(
        (f) =>
          !(
            f.item_type === favItem.item_type &&
            String(f.item_id) === String(favItem.item_id)
          )
      )
    );

    try {
      await removeFavourite(uiType, favItem.item_id);
      refreshFavourites?.();
    } catch {
      refreshFavourites?.();
    }
  };

  // =========================================================
  // Render helpers
  // =========================================================
  const blocksOrdered = (profileBlocks || [])
    .filter((b) => b.display !== false)
    .slice()
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  const renderFavoritesBlock = (block) => {
    const subtype = String(block.subtype || "").toLowerCase();

    if (subtype === "albums") {
      if (hiddenFavSections.album) return null;
      return (
        <ProfileSection
          key={block.profile_block_id}
          title="Favourite Albums"
          onEditPress={() => openEditOverlay("Edit Favourite Albums", "album")}
        >
          {isGuest || showFavLoading ? (
            <PlaceholderSlider type="album" count={3} />
          ) : (
            <FavouritesRow3
              items={favouriteAlbums}
              onPressAdd={() => openSearchOverlay("Add Favourite Album")}
              onPressItem={() => {}}
            />
          )}
        </ProfileSection>
      );
    }

    if (subtype === "tracks") {
      if (hiddenFavSections.song) return null;
      return (
        <ProfileSection
          key={block.profile_block_id}
          title="Favourite Songs"
          onEditPress={() => openEditOverlay("Edit Favourite Songs", "song")}
        >
          {isGuest || showFavLoading ? (
            <PlaceholderSlider type="song" count={3} />
          ) : (
            <FavouritesRow3
              items={favouriteSongs}
              onPressAdd={() => openSearchOverlay("Add Favourite Song")}
              onPressItem={() => {}}
            />
          )}
        </ProfileSection>
      );
    }

    if (subtype === "artists") {
      if (hiddenFavSections.artist) return null;
      return (
        <ProfileSection
          key={block.profile_block_id}
          title="Favourite Artists"
          onEditPress={() => openEditOverlay("Edit Favourite Artists", "artist")}
        >
          {isGuest || showFavLoading ? (
            <PlaceholderSlider type="artist" count={3} />
          ) : (
            <FavouritesRow3
              items={favouriteArtists}
              onPressAdd={() => openSearchOverlay("Add Favourite Artist")}
              onPressItem={() => {}}
            />
          )}
        </ProfileSection>
      );
    }

    return null;
  };

  return (
    <AuthGate mode="onEnter" onCancel="back" message="Log in to view your profile.">
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <View style={[styles.notchBg, { height: insetsTop }]} pointerEvents="none" />

        <ProfileTopBar
          settingsOpen={settingsOpen}
          topBarTranslateY={topBarTranslateY}
          totalHeight={TOPBAR_TOTAL_HEIGHT}
          paddingTop={TOPBAR_PADDING_TOP}
          rowHeight={TOPBAR_ROW_HEIGHT}
          usernameTitle={usernameTitle}
          onOpenCreate={openCreate}
          onOpenSettings={openSettings}
        />

        <Animated.ScrollView
          style={styles.screen}
          contentContainerStyle={[styles.scrollContent, { paddingTop: TOPBAR_TOTAL_HEIGHT }]}
          scrollEventThrottle={16}
          bounces
          alwaysBounceVertical
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={loadingFavourites || loadingBlocks}
              onRefresh={async () => {
                await Promise.all([refreshFavourites?.(), refreshBlocks()]);
              }}
              tintColor={COLORS.text}
            />
          }
        >
          <Animated.View style={[styles.scrollInner, { transform: [{ translateY: topBarTranslateY }] }]}>
            <ProfileHeader
              isGuest={isGuest}
              avatarUrl={avatarUrl}
              bio={bio}
              givenName={givenName}
              stats={stats}
              onEditProfile={openSettings}
              onShareProfile={() => {}}
            />

            <ProfileTabsBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            {!isGuest && activeTab === "Home" && (
              <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => setCustomizeOpen(true)}
                  activeOpacity={0.85}
                  style={{ alignSelf: "flex-start" }}
                >
                  <Text style={{ color: COLORS.subtext, fontWeight: "800", fontSize: 12 }}>
                    Customize profile
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === "Home" && (
              <>
                {/* If still empty after attempted default creation */}
                {/* While loading blocks (initial), show placeholders instead of "empty" */}
                {!isGuest && !blocksReady ? (
                  <>
                    <ProfileSection title="Favourite Albums">
                      <PlaceholderSlider type="album" count={3} />
                    </ProfileSection>
                    <ProfileSection title="Favourite Songs">
                      <PlaceholderSlider type="song" count={3} />
                    </ProfileSection>
                    <ProfileSection title="Favourite Artists">
                      <PlaceholderSlider type="artist" count={3} />
                    </ProfileSection>
                  </>
                ) : !isGuest && profileBlocks.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <Text style={styles.placeholderText}>Profile is empty.</Text>
                  </View>
                ) : (
                  <>
                    {blocksOrdered.map((b) => {
                      if (b.block_type !== "favorites") return null;
                      return renderFavoritesBlock(b);
                    })}
                    {/* Activity etc... */}
                  </>
                )}
              </>
            )}
          </Animated.View>
        </Animated.ScrollView>

        {!settingsOpen && <FooterBar router={router} insets={insets} />}

        {!isGuest && settingsOpen && (
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
            bio={bio}
            setBio={setBio}
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

        {createOpen && (
          <CreateOverlay
            anim={createAnim}
            onClose={closeCreate}
            onPick={(type) => {
              closeCreate();
              console.log("Create:", type);
            }}
          />
        )}

        <FavouritesSearchOverlay
          open={favSearchOpen}
          onClose={() => setFavSearchOpen(false)}
          title={favOverlayTitle}
        />

        <FavouritesEditOverlay
          open={favEditOpen}
          onClose={() => setFavEditOpen(false)}
          title={favOverlayTitle}
          items={editItems}
          onRemoveItem={handleRemoveFavourite}
          onPressAdd={() => {
            setFavEditOpen(false);
            setFavSearchOpen(true);
          }}
          isHidden={editingKey ? !!hiddenFavSections[editingKey] : false}
          onToggleHide={(nextHidden) => {
            if (!editingKey) return;
            setHidden(editingKey, nextHidden);
          }}

          // ✅ NEW: used by the draggable overlay to update UI instantly
          onLocalReorder={(updatedItems) => {
            // updatedItems = the 1–3 items for THIS bucket with new ranks
            setFavourites((prev) => {
              const map = new Map(
                updatedItems.map((x) => [`${x.item_type}-${x.item_id}`, x.rank])
              );
              return prev.map((f) => {
                const k = `${f.item_type}-${f.item_id}`;
                if (!map.has(k)) return f;
                return { ...f, rank: map.get(k) };
              });
            });
          }}
        />



        <ProfileSectionsOverlay
          open={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          blocks={profileBlocks}
          setBlocks={setProfileBlocks}
          onReorder={reorderProfileBlocks}
          onToggleDisplay={setProfileBlockDisplay}
        />

      </SafeAreaView>
    </AuthGate>
  );
}

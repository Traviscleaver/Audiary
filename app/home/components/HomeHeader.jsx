import {
  COLORS,
  Feather,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "../../shared/imports";
import { styles } from "../styles/styles";

export default function HomeHeader({
  insetsTop,
  query,
  setQuery,
  searchOpen,
  openSearchOverlay,
  closeSearchOverlay,
  searchInputRef,
}) {
  return (
    <>
      {/* FULL NOTCH BACKGROUND */}
      <View style={[styles.notchBg, { height: insetsTop }]} />

      {/* NAVBAR */}
      <View style={[styles.header, { paddingTop: insetsTop + 8, zIndex: 1000 }]}>
        <Text style={styles.appTitle}>Audiary</Text>

        {/* SEARCH BAR */}
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
          <View style={[styles.searchBarContainer, { flex: 1 }]}>
            <Feather name="search" size={18} color={COLORS.subtext} style={{ marginRight: 6 }} />

            <TextInput
              ref={searchInputRef}
              placeholder="What have you been listening to?"
              placeholderTextColor={COLORS.subtext}
              value={query}
              onFocus={() => {
                if (!searchOpen) openSearchOverlay();
              }}
              onChangeText={setQuery}
              style={styles.searchInput}
            />

            {searchOpen && query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {searchOpen && (
            <TouchableOpacity onPress={closeSearchOverlay} style={{ paddingLeft: 10 }}>
              <Text style={{ color: COLORS.subtext, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

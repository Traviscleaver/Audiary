import {
  COLORS,
  Feather,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "../../shared/imports";
import { styles } from "../styles/styles";

export default function SearchHeader({
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
      {/* notch bg */}
      <View style={[styles.notchBg, { height: insetsTop }]} />

      {/* navbar */}
      <View style={[styles.navbar, { paddingTop: insetsTop + 8 }]}>
        <Text style={styles.title}>Audiary</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchPill}>
            <Feather name="search" size={18} color={COLORS.subtext} style={{ marginRight: 6 }} />

            <TextInput
              ref={searchInputRef}
              placeholder="Search for music"
              placeholderTextColor={COLORS.subtext}
              value={query}
              onChangeText={setQuery}
              onFocus={() => {
                if (!searchOpen) openSearchOverlay();
              }}
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
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

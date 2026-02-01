// app/search/ui/SearchHeader.jsx
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
  placeholder,
}) {
  return (
    <>
      <View style={[styles.notchBg, { height: insetsTop }]} />

      <View style={[styles.navbar, { paddingTop: insetsTop + 8 }]}>


        <View style={styles.searchRow}>
          <View style={styles.searchPill}>
            <Feather
              name="search"
              size={18}
              color={COLORS.subtext}
              style={{ marginRight: 6 }}
            />

            <TextInput
              ref={searchInputRef}
              placeholder={placeholder || "Search"}
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
            <TouchableOpacity
              onPress={closeSearchOverlay}
              style={{ paddingLeft: 10 }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

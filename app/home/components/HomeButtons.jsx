// app/home/components/HomeButtons.jsx
import { Text, TouchableOpacity, View } from "../../shared/imports";
import { styles } from "../styles/styles";

export default function HomeButtons({ onPress }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 16 }}>
      {/* Section title (matches the vibe of your other section headers) */}
      <Text style={styles.homeSectionTitle}>Start browsing</Text>

      {/* 2x2 grid */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => onPress("TRENDING_SONGS")}
          activeOpacity={0.85}
          style={styles.gridBtnStyle}
        >
          <Text style={styles.gridBtnTextStyle}>TRENDING SONGS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPress("TRENDING_REVIEWS")}
          activeOpacity={0.85}
          style={styles.gridBtnStyle}
        >
          <Text style={styles.gridBtnTextStyle}>TRENDING REVIEWS</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={() => onPress("TRENDING_GROUPS")}
          activeOpacity={0.85}
          style={styles.gridBtnStyle}
        >
          <Text style={styles.gridBtnTextStyle}>TRENDING GROUPS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPress("NEW_RELEASES")}
          activeOpacity={0.85}
          style={styles.gridBtnStyle}
        >
          <Text style={styles.gridBtnTextStyle}>NEW RELEASES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

import {
  Text,
  View
} from "../../shared/imports";
import { styles } from "../styles/styles";

export default function HomeHeader({
  insetsTop,
}) {
  return (
    <>
      {/* FULL NOTCH BACKGROUND */}
      <View style={[styles.notchBg, { height: insetsTop }]} />

      {/* NAVBAR */}
      <View style={[styles.header, { paddingTop: insetsTop + 8, zIndex: 1000 }]}>
        <Text style={styles.appTitle}>Audiary</Text>
      </View>
    </>
  );
}

// app/profile/components/ProfileHeader.jsx
import {
  COLORS,
  Feather,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/imports";
import { styles } from "../styles/styles";
import InlineStat from "./InlineStat";

/**
 * Profile “IG style” header section.
 * Pure presentational component.
 */
export default function ProfileHeader({
  isGuest,
  avatarUrl,
  bio,
  givenName,
  stats,
  onEditProfile,
  onShareProfile,
}) {
  return (
    <View style={styles.igHeaderWrap}>
      <View style={styles.igHeaderRow}>
        {/* LEFT */}
        <View style={styles.igLeftCol}>
          <View style={styles.avatar}>
            {!isGuest && avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 999 }}
              />
            ) : (
              <Feather name="user" size={48} color={COLORS.subtext} />
            )}
          </View>

          <Text style={styles.igBioText}>
            {isGuest
              ? "Create account"
              : bio || ""}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.igRightCol}>
          <Text style={styles.igGivenName} numberOfLines={1}>
            {isGuest ? "" : givenName || ""}
          </Text>

          <View style={styles.igStatsRow}>
            <InlineStat count={isGuest ? 0 : stats.total_reviews || 0} label="reviews" />
            <InlineStat count={isGuest ? 0 : stats.total_ratings || 0} label="followers" />
            <InlineStat
              count={isGuest ? 0 : stats.total_songs_listened || 0}
              label="following"
            />
          </View>
        </View>
      </View>

      {!isGuest && (
        <View style={styles.profileBtnWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.profileBtn}
            onPress={onEditProfile}
          >
            <Text style={styles.profileBtnText}>Edit profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.profileBtn}
            onPress={onShareProfile}
          >
            <Text style={styles.profileBtnText}>Share profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

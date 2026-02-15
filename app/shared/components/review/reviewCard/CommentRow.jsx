import { Text, View } from "../../../imports";

export default function CommentRow({ c, styles }) {
  return (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {(c.username?.[0] || "U").toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.commentTopLine}>
          <Text style={styles.commentUser} numberOfLines={1}>
            {c.username || "User"}
          </Text>
          {c.timeLabel ? <Text style={styles.commentTime}>{c.timeLabel}</Text> : null}
        </View>

        <Text style={styles.commentBody}>{c.body}</Text>
      </View>
    </View>
  );
}

// app/profile/components/settings/SettingsContent.jsx
import {
  COLORS,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "../../../shared/imports";
import { overlayStyles as styles } from "./styles";
import ProfilePictureButton from "./ProfilePictureButton";

/**
 * Pure content (no animation, no API).
 * Just renders the rows.
 */
export default function SettingsContent({
  // NEW:
  profileImageUri,
  onUpdateProfileImage, // async (uri) => void
  onRemoveProfileImage, // async () => void

  givenName,
  setGivenName,
  familyName,
  setFamilyName,
  website,
  setWebsite,
  bio,
  setBio,
  openBioOverlay,

  handle,
  setHandle,
  email,
  openEmailOverlay,

  activityOn,
  setActivityOn,
  notificationsOn,
  setNotificationsOn,

  onOpenPassword,
  onOpenBlocked,
  onSignOut,
}) {
  return (
    <ScrollView style={styles.sheetScroll}>
      {/* Profile Picture (Instagram style) */}
      <ProfilePictureButton
        uri={profileImageUri}
        onUpdate={onUpdateProfileImage}
        onRemove={onRemoveProfileImage}
      />

      {/* PROFILE */}
      <Text style={[styles.smallHeader, { marginTop: 15 }]}>PROFILE</Text>

      <View style={styles.rowEditable}>
        <Text style={styles.editLabel}>Given name</Text>
        <TextInput
          value={givenName}
          onChangeText={setGivenName}
          placeholder="Given name"
          placeholderTextColor={COLORS.faint}
          style={styles.editInput}
        />
      </View>

      <View style={styles.rowEditable}>
        <Text style={styles.editLabel}>Family name</Text>
        <TextInput
          value={familyName}
          onChangeText={setFamilyName}
          placeholder="Family name"
          placeholderTextColor={COLORS.faint}
          style={styles.editInput}
        />
      </View>

      <View style={styles.rowEditable}>
        <Text style={styles.editLabel}>Website</Text>
        <TextInput
          value={website}
          onChangeText={setWebsite}
          placeholder="Website"
          placeholderTextColor={COLORS.faint}
          style={styles.editInput}
        />
      </View>

      <TouchableOpacity style={styles.rowEditable} onPress={openBioOverlay}>
        <Text style={styles.editLabel}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Bio"
          placeholderTextColor={COLORS.faint}
          style={styles.editInput}
        />
      </TouchableOpacity>

      {/* ACCOUNT */}
      <Text style={styles.smallHeader}>ACCOUNT</Text>

      <View style={[styles.rowEditable, { borderBottomWidth: 0 }]}>
        <Text style={styles.editLabel}>Username</Text>
        <TextInput
          value={handle}
          onChangeText={setHandle}
          placeholder="Username"
          placeholderTextColor={COLORS.faint}
          style={styles.editInput}
          maxLength={36}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
      </View>

      <TouchableOpacity style={styles.rowTouchable} onPress={openEmailOverlay}>
        <Text style={styles.editLabel}>Email address</Text>
        <Text style={styles.editValue}>{email}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowChevron} onPress={onOpenPassword} activeOpacity={0.75}>
        <Text style={styles.editLabel}>Change Password</Text>
        <Text style={styles.chevron}>&gt;</Text>
      </TouchableOpacity>

      {/* ACTIVITY */}
      <View style={styles.rowToggle}>
        <Text style={styles.editLabel}>Activity Status</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActivityOn((v) => !v)}
          style={[styles.toggle, activityOn ? styles.toggleOn : styles.toggleOff]}
        >
          <View style={[styles.toggleKnob, activityOn ? styles.knobOn : styles.knobOff]} />
        </TouchableOpacity>
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.rowToggle}>
        <Text style={styles.editLabel}>Notifications</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setNotificationsOn((v) => !v)}
          style={[styles.toggle, notificationsOn ? styles.toggleOn : styles.toggleOff]}
        >
          <View
            style={[
              styles.toggleKnob,
              notificationsOn ? styles.knobOn : styles.knobOff,
            ]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.rowChevron} onPress={onOpenBlocked} activeOpacity={0.75}>
        <Text style={styles.editLabel}>Blocked</Text>
        <Text style={styles.chevron}>&gt;</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowTouchable} onPress={onSignOut}>
        <Text style={[styles.editLabel, { color: COLORS.danger }]}>Sign out</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

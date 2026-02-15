import { supabase } from "./supabase";

export async function uploadAvatar({ userId, localUri }) {
  if (!userId) throw new Error("Missing userId");
  if (!localUri) throw new Error("Missing localUri");

  // 1) Turn local file into Blob
  const res = await fetch(localUri);
  const blob = await res.blob();

  // 2) File path in bucket (keep stable so replacing is easy)
  const ext = localUri.split(".").pop()?.split("?")[0] || "jpg";
  const path = `users/${userId}/avatar.${ext}`;

  // 3) Upload (upsert replaces existing)
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw error;

  // 4) Get public URL (if bucket is public)
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/**
 * reviewPayload.js
 *
 * Review == rating (score) + optional text.
 * Target is polymorphic:
 * - song: includes song_id
 * - album: includes album_id
 *
 * This builder ensures we send exactly one target id.
 */

export function buildUpsertReviewPayload({ target, rating, content }) {
  if (!target) throw new Error("Missing target");
  if (typeof rating !== "number") throw new Error("Missing rating");

  const base = {
    rating,
    content: (content ?? "").trim(), // blank is allowed
  };

  if (target.targetType === "song") {
    if (!target.songId) throw new Error("Missing songId");
    return { ...base, song_id: target.songId };
  }

  if (target.targetType === "album") {
    if (!target.albumId) throw new Error("Missing albumId");
    return { ...base, album_id: target.albumId };
  }

  throw new Error(`Unsupported targetType: ${target.targetType}`);
}

// server/controllers/ensureController.js
const { pool } = require("../db");
const {
  getSpotifyTrack,
  getSpotifyAlbum,
  getSpotifyArtistsByIds,
} = require("../lib/spotifyClient");

// ---------- helpers ----------
function yearFromReleaseDate(release_date) {
  if (!release_date) return null;
  const y = Number(String(release_date).slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function pickLargestImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null;
  // Spotify usually returns largest first
  return images[0]?.url || null;
}

async function upsertArtist(client, artist) {
  // artist is Spotify artist object
  const spotify_id = artist?.id || null;
  const name = artist?.name || null;
  const image_url = pickLargestImage(artist?.images);
  const followers = artist?.followers?.total ?? null;
  const genres = Array.isArray(artist?.genres) ? artist.genres : [];

  if (!spotify_id || !name) throw new Error("Invalid artist payload");

  const result = await client.query(
    `
    INSERT INTO artists (spotify_id, name, image_url, followers, genres, last_fetched)
    VALUES ($1,$2,$3,$4,$5, NOW())
    ON CONFLICT (spotify_id)
    DO UPDATE SET
      name = COALESCE(EXCLUDED.name, artists.name),
      image_url = COALESCE(EXCLUDED.image_url, artists.image_url),
      followers = COALESCE(EXCLUDED.followers, artists.followers),
      genres = COALESCE(EXCLUDED.genres, artists.genres),
      last_fetched = NOW()
    RETURNING artist_id
    `,
    [spotify_id, name, image_url, followers, genres]
  );

  return result.rows[0].artist_id;
}

async function upsertAlbum(client, album, artist_id) {
  const spotify_id = album?.id || null;
  const title = album?.name || null;

  const release_year = yearFromReleaseDate(album?.release_date);
  const cover_url = pickLargestImage(album?.images);
  const total_tracks = album?.total_tracks ?? null;

  if (!spotify_id || !title) throw new Error("Invalid album payload");

  const result = await client.query(
    `
    INSERT INTO albums (spotify_id, artist_id, title, release_year, cover_url, total_tracks, last_fetched)
    VALUES ($1,$2,$3,$4,$5,$6, NOW())
    ON CONFLICT (spotify_id)
    DO UPDATE SET
      artist_id = COALESCE(EXCLUDED.artist_id, albums.artist_id),
      title = COALESCE(EXCLUDED.title, albums.title),
      release_year = COALESCE(EXCLUDED.release_year, albums.release_year),
      cover_url = COALESCE(EXCLUDED.cover_url, albums.cover_url),
      total_tracks = COALESCE(EXCLUDED.total_tracks, albums.total_tracks),
      last_fetched = NOW()
    RETURNING album_id
    `,
    [spotify_id, artist_id, title, release_year, cover_url, total_tracks]
  );

  return result.rows[0].album_id;
}

async function upsertSong(client, track, album_id) {
  const spotify_id = track?.id || null;
  const title = track?.name || null;

  const duration = track?.duration_ms ? Math.round(track.duration_ms / 1000) : null;
  const track_number = track?.track_number ?? null;

  const isrc = track?.external_ids?.isrc || null;
  const popularity = track?.popularity ?? null;
  const preview_url = track?.preview_url || null;
  const spotify_url = track?.external_urls?.spotify || null;

  if (!spotify_id || !title) throw new Error("Invalid track payload");

  const result = await client.query(
    `
    INSERT INTO songs (
      spotify_id, album_id, title, duration, track_number,
      isrc, popularity, preview_url, spotify_url, last_fetched
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
    ON CONFLICT (spotify_id)
    DO UPDATE SET
      album_id = COALESCE(EXCLUDED.album_id, songs.album_id),
      title = COALESCE(EXCLUDED.title, songs.title),
      duration = COALESCE(EXCLUDED.duration, songs.duration),
      track_number = COALESCE(EXCLUDED.track_number, songs.track_number),
      isrc = COALESCE(EXCLUDED.isrc, songs.isrc),
      popularity = COALESCE(EXCLUDED.popularity, songs.popularity),
      preview_url = COALESCE(EXCLUDED.preview_url, songs.preview_url),
      spotify_url = COALESCE(EXCLUDED.spotify_url, songs.spotify_url),
      last_fetched = NOW()
    RETURNING song_id
    `,
    [spotify_id, album_id, title, duration, track_number, isrc, popularity, preview_url, spotify_url]
  );

  return result.rows[0].song_id;
}

// =======================================
// POST /ensure/track/:spotifyTrackId
// Ensures artist+album+song exist; returns DB ids
// =======================================
exports.ensureTrack = async (req, res) => {
  const spotifyTrackId = req.params.spotifyTrackId;

  try {
    // quick DB hit: already imported?
    const existing = await pool.query(
      `SELECT song_id FROM songs WHERE spotify_id = $1 LIMIT 1`,
      [spotifyTrackId]
    );
    if (existing.rows[0]) {
      return res.json({ song_id: existing.rows[0].song_id, existed: true });
    }

    // fetch from Spotify
    const track = await getSpotifyTrack(spotifyTrackId);
    const album = track?.album;
    const trackArtists = Array.isArray(track?.artists) ? track.artists : [];
    const primaryArtistId = trackArtists[0]?.id;

    // artist details for genres/images
    const fullArtists = await getSpotifyArtistsByIds([primaryArtistId]);
    const primaryArtist = fullArtists[0];

    if (!album || !primaryArtist) {
      return res.status(400).json({ error: "Spotify track missing album/artist" });
    }

    // transaction: upsert artist -> album -> song
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const artist_id = await upsertArtist(client, primaryArtist);
      const album_id = await upsertAlbum(client, album, artist_id);
      const song_id = await upsertSong(client, track, album_id);

      await client.query("COMMIT");
      return res.status(201).json({ song_id, album_id, artist_id, existed: false });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("ensureTrack error:", err);
    return res.status(500).json({ error: "Failed to ensure track" });
  }
};

// =======================================
// POST /ensure/album/:spotifyAlbumId
// Ensures artist+album exist; does NOT import songs
// =======================================
exports.ensureAlbum = async (req, res) => {
  const spotifyAlbumId = req.params.spotifyAlbumId;

  try {
    const existing = await pool.query(
      `SELECT album_id FROM albums WHERE spotify_id = $1 LIMIT 1`,
      [spotifyAlbumId]
    );
    if (existing.rows[0]) {
      return res.json({ album_id: existing.rows[0].album_id, existed: true });
    }

    const album = await getSpotifyAlbum(spotifyAlbumId);

    const albumArtists = Array.isArray(album?.artists) ? album.artists : [];
    const primaryArtistId = albumArtists[0]?.id;

    const fullArtists = await getSpotifyArtistsByIds([primaryArtistId]);
    const primaryArtist = fullArtists[0];

    if (!primaryArtist) {
      return res.status(400).json({ error: "Spotify album missing artist" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const artist_id = await upsertArtist(client, primaryArtist);
      const album_id = await upsertAlbum(client, album, artist_id);

      await client.query("COMMIT");
      return res.status(201).json({ album_id, artist_id, existed: false });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("ensureAlbum error:", err);
    return res.status(500).json({ error: "Failed to ensure album" });
  }
};

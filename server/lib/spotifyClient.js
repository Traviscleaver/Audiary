// server/lib/spotifyClient.js
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let tokenCache = { access_token: null, expires_at: 0 };

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (tokenCache.access_token && now < tokenCache.expires_at - 10_000) {
    return tokenCache.access_token;
  }

  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Spotify token error: ${res.status} ${txt.slice(0, 200)}`);
  }

  const json = await res.json();
  tokenCache.access_token = json.access_token;
  tokenCache.expires_at = Date.now() + json.expires_in * 1000;

  return tokenCache.access_token;
}

async function spotifyGet(path) {
  const token = await getSpotifyAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Spotify GET ${path} failed: ${res.status} ${txt.slice(0, 200)}`);
  }

  return res.json();
}

function pickLargestImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null;
  return images[0]?.url || null; // spotify usually largest first
}

/** ---------------- Existing ---------------- */
async function getSpotifyTrack(trackId) {
  return spotifyGet(`/tracks/${encodeURIComponent(trackId)}`);
}

async function getSpotifyAlbum(albumId) {
  return spotifyGet(`/albums/${encodeURIComponent(albumId)}`);
}

async function getSpotifyArtistsByIds(ids) {
  const clean = ids.filter(Boolean);
  if (!clean.length) return [];
  const res = await spotifyGet(`/artists?ids=${encodeURIComponent(clean.join(","))}`);
  return res?.artists || [];
}

// ✅ NEW: Get single Spotify artist (full object: images/genres/followers)
async function getSpotifyArtist(artistId) {
  const id = String(artistId || "").trim();
  if (!id) throw new Error("Missing artistId");
  return spotifyGet(`/artists/${encodeURIComponent(id)}`);
}

/** ---------------- New: SEARCH ---------------- */

/**
 * Search Spotify Tracks
 * @param {string} query
 * @param {{ limit?: number, market?: string }} opts
 * @returns {Promise<{ tracks: Array }>}
 */
async function searchSpotifyTracks(query, opts = {}) {
  const q = String(query || "").trim();
  if (!q) return { tracks: [] };

  const limit = Math.min(Math.max(Number(opts.limit ?? 20), 1), 50);
  const market = opts.market || "US"; // choose your default

  const res = await spotifyGet(
    `/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}&market=${encodeURIComponent(
      market
    )}`
  );

  const items = res?.tracks?.items || [];
  const mapped = items.map((track) => {
    const album = track?.album;
    return {
      id: track?.id,
      name: track?.name || "",
      artist:
        (track?.artists || []).map((a) => a?.name).filter(Boolean).join(", ") ||
        "Unknown Artist",
      album: album?.name || "",
      coverUrl: pickLargestImage(album?.images),
      popularity: track?.popularity ?? 0,
      releaseDate: album?.release_date || null,
      trackNumber: track?.track_number ?? null,
      discNumber: track?.disc_number ?? null,
      spotifyUrl: track?.external_urls?.spotify || null,
    };
  });

  // Basic dedupe: name|artist
  const seen = new Set();
  const deduped = [];
  for (const t of mapped) {
    const key = `${(t.name || "").toLowerCase()}|${(t.artist || "").toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(t);
  }

  // Sort by popularity desc (optional)
  deduped.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  return { tracks: deduped };
}

/**
 * Search Spotify Albums
 * @param {string} query
 * @param {{ limit?: number, market?: string }} opts
 * @returns {Promise<{ albums: Array }>}
 */
async function searchSpotifyAlbums(query, opts = {}) {
  const q = String(query || "").trim();
  if (!q) return { albums: [] };

  const limit = Math.min(Math.max(Number(opts.limit ?? 20), 1), 50);
  const market = opts.market || "US";

  const res = await spotifyGet(
    `/search?q=${encodeURIComponent(q)}&type=album&limit=${limit}&market=${encodeURIComponent(
      market
    )}`
  );

  const items = res?.albums?.items || [];
  const mapped = items.map((album) => ({
    id: album?.id,
    title: album?.name || "",
    artist:
      (album?.artists || []).map((a) => a?.name).filter(Boolean).join(", ") ||
      "Unknown Artist",
    type: album?.album_type || null,
    coverUrl: pickLargestImage(album?.images),
    releaseDate: album?.release_date || null,
    trackCount: album?.total_tracks ?? null,
    spotifyUrl: album?.external_urls?.spotify || null,
  }));

  // Dedupe title|artist
  const seen = new Set();
  const deduped = [];
  for (const a of mapped) {
    const key = `${(a.title || "").toLowerCase()}|${(a.artist || "").toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(a);
  }

  deduped.sort((a, b) => String(a.title).localeCompare(String(b.title)));

  return { albums: deduped };
}

/** ---------------- Optional: Album Tracks ---------------- */
async function getSpotifyAlbumTracks(albumId, opts = {}) {
  const id = String(albumId || "").trim();
  if (!id) return { tracks: [] };

  const market = opts.market || "US";
  const limit = 50;

  let url = `/albums/${encodeURIComponent(id)}/tracks?limit=${limit}&market=${encodeURIComponent(
    market
  )}`;

  const all = [];
  while (url) {
    const data = await spotifyGet(url);
    const items = data?.items || [];
    all.push(...items);

    // spotify returns `next` as full url, but our spotifyGet expects path.
    // Convert it back to path:
    if (data?.next) {
      const nextUrl = new URL(data.next);
      url = nextUrl.pathname.replace("/v1", "") + nextUrl.search;
    } else {
      url = null;
    }
  }

  const out = all.map((t, idx) => ({
    id: t?.id ?? `${id}-${idx + 1}`,
    name: t?.name || `Track ${idx + 1}`,
    track_number: t?.track_number ?? idx + 1,
    artists: (t?.artists || []).map((a) => a?.name).filter(Boolean),
    spotifyUrl:
      t?.external_urls?.spotify || (t?.id ? `https://open.spotify.com/track/${t.id}` : null),
  }));

  out.sort((a, b) => (a.track_number ?? 0) - (b.track_number ?? 0));
  return { tracks: out };
}

module.exports = {
  getSpotifyTrack,
  getSpotifyAlbum,
  getSpotifyArtistsByIds,
  getSpotifyArtist, // ✅ EXPORT IT

  // ✅ new exports
  searchSpotifyTracks,
  searchSpotifyAlbums,
  getSpotifyAlbumTracks,
};

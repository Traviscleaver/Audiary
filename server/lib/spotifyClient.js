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

module.exports = {
  getSpotifyTrack,
  getSpotifyAlbum,
  getSpotifyArtistsByIds,
};

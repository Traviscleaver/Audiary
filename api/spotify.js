// api/spotify.js
import { encode as btoa } from "base-64";

const CLIENT_ID = "c7d7aa47c5554dff888bf92c0a16928e";
const CLIENT_SECRET = "1b7386a050114a7eaf57b6569e386d12";

async function getSpotifyToken() {
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// Pick the best available image (prefer largest first, then fallbacks)
const pickImage = (images) =>
  images?.[0]?.url || images?.[1]?.url || images?.[2]?.url || null;

// Deduplicate by a key, keep the most popular item
function deduplicateAndSort(items, keyFn) {
  const map = {};
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map[key] || (item.popularity ?? 0) > (map[key].popularity ?? 0)) {
      map[key] = item;
    }
  });
  return Object.values(map).sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
  );
}

// ===== Albums =====
export async function searchAlbumsSpotify(query) {
  if (!query) return { albums: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=album&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const albums = data.albums?.items || [];

    const mapped = albums.map((album) => {
      const artist = album.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      return {
        id: album.id,
        title: (album.name || "").trim(),
        artist,
        type: album.album_type, // album | single | compilation
        coverUrl: pickImage(album.images),
        popularity: album.popularity ?? 0, // often absent in /search; keep 0
        releaseDate: album.release_date || null,
        trackCount: album.total_tracks ?? null,
        spotifyUrl: album.external_urls?.spotify || null,
      };
    });

    return {
      albums: deduplicateAndSort(
        mapped,
        (a) => `${a.title.toLowerCase()}|${a.artist.toLowerCase()}`
      ),
    };
  } catch (err) {
    console.error("Spotify albums search error:", err);
    return { albums: [] };
  }
}

// ===== Tracks =====
export async function searchTracksSpotify(query) {
  if (!query) return { tracks: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const tracks = data.tracks?.items || [];

    const mapped = tracks.map((track) => {
      const artist = track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      const album = track.album || {};
      return {
        id: track.id,
        name: track.name,
        artist,
        popularity: track.popularity ?? 0,
        album: album.name || "",
        coverUrl: pickImage(album.images),
        releaseDate: album.release_date || null,
        trackNumber: track.track_number ?? null,
        discNumber: track.disc_number ?? null,
        spotifyUrl: track.external_urls?.spotify || null,
      };
    });

    return {
      tracks: deduplicateAndSort(
        mapped,
        (a) => `${a.name.toLowerCase()}|${a.artist.toLowerCase()}`
      ),
    };
  } catch (err) {
    console.error("Spotify tracks search error:", err);
    return { tracks: [] };
  }
}

// ===== Artists =====
export async function searchArtistsSpotify(query) {
  if (!query) return { artists: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=artist&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const artists = data.artists?.items || [];

    const mapped = artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity ?? 0,
      imageUrl: pickImage(artist.images),
      genres: artist.genres || [],
      spotifyUrl: artist.external_urls?.spotify || null,
    }));

    return { artists: deduplicateAndSort(mapped, (a) => a.name.toLowerCase()) };
  } catch (err) {
    console.error("Spotify artists search error:", err);
    return { artists: [] };
  }
}

// ===== Album Tracks (normalized) =====
export async function getAlbumTracksSpotify(albumId) {
  if (!albumId) return { tracks: [] };
  try {
    const token = await getSpotifyToken();

    // Fetch all tracks (handles pagination if album has >50 tracks)
    let url = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`;
    const all = [];

    // Spotify pagination via `next` url
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const items = data.items || [];
      all.push(...items);
      if (!data.next) break;
      url = data.next;
    }

    // Normalize to the shape your UI expects
    const normalized = all.map((t, idx) => {
      const artists =
        Array.isArray(t?.artists) ? t.artists.map((a) => a?.name).filter(Boolean) : [];
      return {
        id: t?.id ?? `${albumId}-${idx + 1}`,
        name: t?.name ?? `Track ${idx + 1}`,
        track_number:
          t?.track_number ??
          t?.trackNumber ??
          (typeof t?.trackNo === "number" ? t.trackNo : idx + 1),
        artists,
        spotifyUrl:
          t?.external_urls?.spotify ||
          (t?.id ? `https://open.spotify.com/track/${t.id}` : null),
      };
    });

    // Sort just in case
    normalized.sort(
      (a, b) => (a.track_number ?? 0) - (b.track_number ?? 0)
    );

    return { tracks: normalized };
  } catch (err) {
    console.error("Spotify album tracks fetch error:", err);
    return { tracks: [] };
  }
}

// api/spotify.js
import { encode as btoa } from "base-64";

/* ============================================================
   TOKEN CACHE (CRITICAL SPEED BOOST)
   ============================================================ */
const CLIENT_ID = "c7d7aa47c5554dff888bf92c0a16928e";
const CLIENT_SECRET = "1b7386a050114a7eaf57b6569e386d12";

let _token = null;
let _tokenExpiresAt = 0;

async function getSpotifyToken() {
  const now = Date.now();

  // If token exists and not expired → reuse
  if (_token && now < _tokenExpiresAt) return _token;

  // Otherwise fetch new token
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

  if (!res.ok) {
    console.error("Spotify token error:", data);
    throw new Error("Failed to fetch Spotify token");
  }

  _token = data.access_token;
  _tokenExpiresAt = now + data.expires_in * 1000 - 5000;

  return _token;
}

/* ============================================================
   UTILITIES (FAST)
   ============================================================ */

const pickImage = (images) =>
  images && images.length ? images[0].url || null : null;

// optimized dedupe + sort
function deduplicateAndSort(items, keyFn) {
  const out = Object.create(null);

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const key = keyFn(it);
    const exist = out[key];
    if (!exist || (it.popularity ?? 0) > (exist.popularity ?? 0)) {
      out[key] = it;
    }
  }

  const arr = Object.values(out);
  arr.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  return arr;
}

/* ============================================================
   BILLBOARD HOT 100 PLAYLIST (CRITICAL SPEED BOOST)
   One fetch → shared between Albums + Tracks
   3-minute cache → no lag switching tabs
   ============================================================ */

let _billboardCache = null;
let _billboardCacheTime = 0;

async function fetchBillboardPlaylist() {
  const now = Date.now();

  // Cache for 3 minutes
  if (_billboardCache && now - _billboardCacheTime < 180000) {
    return _billboardCache;
  }

  const token = await getSpotifyToken();
  const playlistId = "6UeSakyzhiEt4NB3UAd6NQ"; // Billboard Hot 100
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  const headers = { Authorization: `Bearer ${token}` };
  const tracks = [];

  while (url) {
    const res = await fetch(url, { headers });
    const data = await res.json();
    const items = data.items || [];
    tracks.push(...items);
    url = data.next;
  }

  _billboardCache = tracks;
  _billboardCacheTime = now;
  return tracks;
}

/* ============================================================
   POPULAR ALBUMS — uses Billboard cache
   ============================================================ */
export async function getTopAlbumsSpotify(limit = 39) {
  if (!limit || limit <= 0) limit = 39;

  try {
    const allItems = await fetchBillboardPlaylist();

    const out = [];
    const seen = new Set();
    let rank = 1;

    for (let i = 0; i < allItems.length && out.length < limit; i++) {
      const track = allItems[i]?.track;
      const album = track?.album;

      if (!track || !album || !album.id) continue;
      if (seen.has(album.id)) continue;

      seen.add(album.id);

      const artists =
        (track.artists || album.artists || [])
          .map((a) => a?.name)
          .filter(Boolean)
          .join(", ") || "Unknown Artist";

      out.push({
        id: album.id,
        rank: rank++,
        title: album.name || "",
        artist: artists,
        type: album.album_type,
        coverUrl: pickImage(album.images),
        popularity: track.popularity ?? 0,
        releaseDate: album.release_date || null,
        trackCount: album.total_tracks ?? null,
        spotifyUrl:
          track.external_urls?.spotify || album.external_urls?.spotify || null,
      });
    }

    return { albums: out };
  } catch (err) {
    console.error("Spotify top albums error:", err);
    return { albums: [] };
  }
}

/* ============================================================
   POPULAR TRACKS — uses Billboard cache
   ============================================================ */
export async function getTopTracksSpotify(limit = 39) {
  if (!limit || limit <= 0) limit = 39;

  try {
    const allItems = await fetchBillboardPlaylist();

    const out = [];
    const seen = new Set();
    let rank = 1;

    for (let i = 0; i < allItems.length && out.length < limit; i++) {
      const track = allItems[i]?.track;
      if (!track || !track.id) continue;
      if (seen.has(track.id)) continue;

      seen.add(track.id);

      const album = track.album;
      const artists =
        track.artists?.map((a) => a?.name).filter(Boolean).join(", ") ||
        "Unknown Artist";

      out.push({
        id: track.id,
        rank: rank++,
        title: track.name,
        artist: artists,
        album: album?.name || "",
        coverUrl: pickImage(album?.images),
        popularity: track.popularity ?? 0,
        releaseDate: album?.release_date || null,
        spotifyUrl: track.external_urls?.spotify || null,
      });
    }

    return { tracks: out };
  } catch (err) {
    console.error("Spotify top tracks error:", err);
    return { tracks: [] };
  }
}

/* ============================================================
   ALBUM SEARCH
   ============================================================ */
export async function searchAlbumsSpotify(query) {
  if (!query) return { albums: [] };

  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=album&limit=50`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Spotify album search error:", data);
      return { albums: [] };
    }

    const items = data.albums?.items || [];
    const mapped = items.map((album) => ({
      id: album.id,
      title: album.name || "",
      artist: album.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
      type: album.album_type,
      coverUrl: pickImage(album.images),
      popularity: album.popularity ?? 0,
      releaseDate: album.release_date || null,
      trackCount: album.total_tracks ?? null,
      spotifyUrl: album.external_urls?.spotify || null,
    }));

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

/* ============================================================
   TRACK SEARCH
   ============================================================ */
export async function searchTracksSpotify(query) {
  if (!query) return { tracks: [] };

  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=50`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Spotify track search error:", data);
      return { tracks: [] };
    }

    const items = data.tracks?.items || [];
    const mapped = items.map((track) => {
      const album = track.album;
      return {
        id: track.id,
        name: track.name,
        artist:
          track.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
        popularity: track.popularity ?? 0,
        album: album?.name || "",
        coverUrl: pickImage(album?.images),
        releaseDate: album?.release_date || null,
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

/* ============================================================
   ARTIST SEARCH
   ============================================================ */
export async function searchArtistsSpotify(query) {
  if (!query) return { artists: [] };

  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=artist&limit=50`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Spotify artists search error:", data);
      return { artists: [] };
    }

    const items = data.artists?.items || [];
    const mapped = items.map((a) => ({
      id: a.id,
      name: a.name,
      popularity: a.popularity ?? 0,
      imageUrl: pickImage(a.images),
      genres: a.genres || [],
      spotifyUrl: a.external_urls?.spotify || null,
    }));

    return {
      artists: deduplicateAndSort(mapped, (x) => x.name.toLowerCase()),
    };
  } catch (err) {
    console.error("Spotify artists search error:", err);
    return { artists: [] };
  }
}

/* ============================================================
   ALBUM TRACKS
   ============================================================ */
export async function getAlbumTracksSpotify(albumId) {
  if (!albumId) return { tracks: [] };

  try {
    const token = await getSpotifyToken();
    let url = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`;

    const headers = { Authorization: `Bearer ${token}` };
    const all = [];

    while (url) {
      const res = await fetch(url, { headers });
      const data = await res.json();
      const items = data.items || [];
      all.push(...items);
      url = data.next;
    }

    const out = all.map((t, idx) => ({
      id: t.id ?? `${albumId}-${idx + 1}`,
      name: t.name || `Track ${idx + 1}`,
      track_number: t.track_number ?? idx + 1,
      artists: t.artists?.map((a) => a?.name).filter(Boolean) || [],
      spotifyUrl:
        t.external_urls?.spotify ||
        (t.id ? `https://open.spotify.com/track/${t.id}` : null),
    }));

    out.sort(
      (a, b) => (a.track_number ?? 0) - (b.track_number ?? 0)
    );

    return { tracks: out };
  } catch (err) {
    console.error("Spotify album tracks fetch error:", err);
    return { tracks: [] };
  }
}






/* ============================================================
   LOOKUP BY ID FOR FAVORITES
   ============================================================ */

export async function getAlbumByIdSpotify(id) {
  if (!id) return null;
  const token = await getSpotifyToken();

  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const album = await res.json();
  if (!res.ok) return null;

  return {
    id: album.id,
    title: album.name,
    artist: album.artists?.map(a => a.name).join(", ") || "",
    coverUrl: album.images?.[0]?.url || null,
    trackCount: album.total_tracks,
    releaseDate: album.release_date,
  };
}

export async function getSongByIdSpotify(id) {
  if (!id) return null;
  const token = await getSpotifyToken();

  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const track = await res.json();
  if (!res.ok) return null;

  return {
    id: track.id,
    title: track.name,
    artist: track.artists?.map(a => a.name).join(", ") || "",
    coverUrl: track.album?.images?.[0]?.url || null,
    album: track.album?.name || "",
  };
}

export async function getArtistByIdSpotify(id) {
  if (!id) return null;
  const token = await getSpotifyToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const artist = await res.json();
  if (!res.ok) return null;

  return {
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url || null,
    genres: artist.genres || [],
  };
}

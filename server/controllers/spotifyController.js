// server/controllers/spotifyController.js
const {
  searchSpotifyTracks,
  searchSpotifyAlbums,
  getSpotifyAlbumTracks,
} = require("../lib/spotifyClient");

/**
 * GET /spotify/search/tracks?q=...
 */
exports.searchTracks = async (req, res) => {
  try {
    const q = req.query.q || "";
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const market = req.query.market || "US";

    const out = await searchSpotifyTracks(q, { limit, market });
    return res.json(out); // { tracks: [...] }
  } catch (err) {
    console.error("searchTracks error:", err);
    return res.status(500).json({ tracks: [] });
  }
};

/**
 * GET /spotify/search/albums?q=...
 */
exports.searchAlbums = async (req, res) => {
  try {
    const q = req.query.q || "";
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const market = req.query.market || "US";

    const out = await searchSpotifyAlbums(q, { limit, market });
    return res.json(out); // { albums: [...] }
  } catch (err) {
    console.error("searchAlbums error:", err);
    return res.status(500).json({ albums: [] });
  }
};

/**
 * GET /spotify/albums/:albumId/tracks
 * Optional, if you want album tracklists.
 */
exports.getAlbumTracks = async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const market = req.query.market || "US";

    const out = await getSpotifyAlbumTracks(albumId, { market });
    return res.json(out); // { tracks: [...] }
  } catch (err) {
    console.error("getAlbumTracks error:", err);
    return res.status(500).json({ tracks: [] });
  }
};

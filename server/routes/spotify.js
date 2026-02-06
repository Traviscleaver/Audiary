// server/routes/spotify.js
const express = require("express");
const router = express.Router();

const {
  searchTracks,
  searchAlbums,
  getAlbumTracks,
} = require("../controllers/spotifyController");

// Search
router.get("/search/tracks", searchTracks);
router.get("/search/albums", searchAlbums);

// Optional: album tracklist
router.get("/albums/:albumId/tracks", getAlbumTracks);

module.exports = router;

// routes/songs.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  getSongById,           // GET /songs/:songId
  getSongBySpotifyId,    // GET /songs/spotify/:spotifyId

  getSongRatings,        // GET /songs/:songId/ratings
  getSongReviews,        // GET /songs/:songId/reviews
  getSongDiaryEntries,   // GET /songs/:songId/diary
  getSongStats,          // GET /songs/:songId/stats

  getSongFull,           // GET /songs/:songId/full

  createSong,            // POST /songs
  updateSong,            // PUT /songs/:songId
  deleteSong             // DELETE /songs/:songId
} = require("../controllers/songsController");

/* =========================================
   SONG ROUTES
   ========================================= */

// Public song lookup by id
router.get("/songs/:songId", authOptional, getSongById);

// Public song lookup by Spotify id
router.get("/songs/spotify/:spotifyId", authOptional, getSongBySpotifyId);


/* =========================================
   SONG DATA SUB-ROUTES
   ========================================= */

router.get("/songs/:songId/ratings", authOptional, getSongRatings);
router.get("/songs/:songId/reviews", authOptional, getSongReviews);
router.get("/songs/:songId/diary", authOptional, getSongDiaryEntries);
router.get("/songs/:songId/stats", authOptional, getSongStats);


/* =========================================
   OPTIONAL: FULL SONG BUNDLE
   ========================================= */

router.get("/songs/:songId/full", authOptional, getSongFull);


/* =========================================
   ADMIN / INTERNAL (OPTIONAL)
   If you don't want public writes, keep these authRequired.
   ========================================= */

router.post("/songs", authRequired, createSong);
router.put("/songs/:songId", authRequired, updateSong);
router.delete("/songs/:songId", authRequired, deleteSong);

module.exports = router;

// server/routes/ensure.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const { ensureTrack, ensureAlbum } = require("../controllers/ensureController");

// If you only want logged-in users to import, use authRequired.
// If guests can browse/import, use authOptional.
router.post("/ensure/track/:spotifyTrackId", authRequired, ensureTrack);
router.post("/ensure/album/:spotifyAlbumId", authRequired, ensureAlbum);

module.exports = router;

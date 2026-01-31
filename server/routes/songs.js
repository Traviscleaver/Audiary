const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
    getSongDetails
} = require("../controllers/songsController");



/* =========================================
    SONGS SYSTEM
   ========================================= */

// Current logged-in user's profile

router.get("/songs/:songId/details", authOptional, getSongDetails);

module.exports = router;

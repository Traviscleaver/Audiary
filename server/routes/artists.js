const express = require("express");
const router = express.Router();

const authOptional = require("../middleware/authOptional");
const { getArtistById } = require("../controllers/artistController");

// GET /artists/:artistId
router.get("/artists/:artistId", authOptional, getArtistById);

module.exports = router;

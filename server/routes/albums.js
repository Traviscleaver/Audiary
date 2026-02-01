const express = require("express");
const router = express.Router();

const authOptional = require("../middleware/authOptional");
const { getAlbumById } = require("../controllers/albumController");

// GET /albums/:albumId
router.get("/albums/:albumId", authOptional, getAlbumById);

module.exports = router;

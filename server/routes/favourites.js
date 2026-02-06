// routes/favourites.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");

const {
  setFavourite,
  removeFavourite,
  getMyFavourites,
  existsFavouriteBySpotifyId
} = require("../controllers/favouritesController");

// List my favourites (useful for testing / future screens)
router.get("/favorites", authRequired, getMyFavourites);

// Add favourite (idempotent)
router.post("/favorites", authRequired, setFavourite);

// Remove favourite
router.delete("/favorites", authRequired, removeFavourite);


// Check if a favourite exists by Spotify ID (cheap)
router.get("/favorites/exists", authRequired, existsFavouriteBySpotifyId);

module.exports = router;

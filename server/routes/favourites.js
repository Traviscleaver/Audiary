// routes/favourites.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");

const {
  setFavourite,
  removeFavourite,
  getMyFavourites,
  existsFavouriteBySpotifyId,
  countMyFavouritesByType,
  reorderFavourites,
} = require("../controllers/favouritesController");

// List my favourites
router.get("/favorites", authRequired, getMyFavourites);

// Add favourite
router.post("/favorites", authRequired, setFavourite);

// Remove favourite
router.delete("/favorites", authRequired, removeFavourite);

// Exists by Spotify ID
router.get("/favorites/exists", authRequired, existsFavouriteBySpotifyId);

// ✅ COUNT ENDPOINT (this is the one you're missing)
router.get("/favorites/count", authRequired, countMyFavouritesByType);

router.post("/favorites/reorder", authRequired, reorderFavourites);



module.exports = router;

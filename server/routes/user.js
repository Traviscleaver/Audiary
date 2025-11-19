const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  getProfileSelf,         // GET /profile
  getProfilePublic,       // GET /users/:username/profile

  getUserRatings,
  getUserReviews,
  getUserPlaylists,
  getUserDiary,
  getUserFavorites,
  getUserActivity,
  getUserStats,

  getFullProfile          // GET /users/:username/full (optional, full bundle)
} = require("../controllers/userController");

/* =========================================
   PROFILE ROUTES
   ========================================= */

// Profile of the currently logged-in user (requires JWT)
router.get("/profile", authRequired, getProfileSelf);

// Public profile lookup by username
router.get("/users/:username/profile", authOptional, getProfilePublic);

/* =========================================
   USER DATA SUB-ROUTES
   ========================================= */

router.get("/users/:username/ratings", authOptional, getUserRatings);

router.get("/users/:username/reviews", authOptional, getUserReviews);

router.get("/users/:username/playlists", authOptional, getUserPlaylists);

router.get("/users/:username/diary", authOptional, getUserDiary);

router.get("/users/:username/favorites", authOptional, getUserFavorites);

router.get("/users/:username/activity", authOptional, getUserActivity);

router.get("/users/:username/stats", authOptional, getUserStats);

/* =========================================
   OPTIONAL: FULL PROFILE BUNDLE
   ========================================= */

router.get("/users/:username/full", authOptional, getFullProfile);

module.exports = router;

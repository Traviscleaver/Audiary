const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  getProfileSelf,         // GET /profile (self)
  getProfilePublic,       // GET /users/:username/profile (public)

  getUserRatings,
  getUserReviews,
  getUserPlaylists,
  getUserDiary,
  getUserFavorites,
  getUserActivity,
  getUserStats,

  getFullProfile,         // GET /users/:username/full
  updateProfile           // PUT /profile (self edit)
} = require("../controllers/userController");

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require("../controllers/followController");  // <-- you'll get this file next


/* =========================================
   PROFILE ROUTES
   ========================================= */

// Current logged-in user's profile
router.get("/profile", authRequired, getProfileSelf);

// Update profile (email, username, name, bio, website, banner, etc.)
router.put("/profile", authRequired, updateProfile);

// Public profile lookup by username
router.get("/users/:username/profile", authOptional, getProfilePublic);


/* =========================================
   FOLLOW SYSTEM (NEW)
   ========================================= */

// Follow someone
router.post("/users/:username/follow", authRequired, followUser);

// Unfollow someone
router.delete("/users/:username/follow", authRequired, unfollowUser);

// Get someone's followers
router.get("/users/:username/followers", authOptional, getFollowers);

// Get who someone is following
router.get("/users/:username/following", authOptional, getFollowing);


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

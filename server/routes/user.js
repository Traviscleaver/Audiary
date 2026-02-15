// routes/user.js (or whatever you named this file)
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  getProfileSelf, // GET /profile (self)
  getProfilePublic, // GET /users/:username/profile (public)

  getUserRatings,
  getUserReviews,
  getUserPlaylists,
  getUserDiary,
  getUserFavorites,
  getUserActivity,
  getUserStats,
  getUserPicture,

  getFullProfile, // GET /users/:username/full
  updateProfile, // PUT /profile (self edit)

  searchUsers,
} = require("../controllers/userController");

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/followController");

/* =========================================
   PROFILE ROUTES
   ========================================= */

router.get("/__ping", (req, res) => res.json({ ok: true }));

// Current logged-in user's profile
router.get("/profile", authRequired, getProfileSelf);

// Update profile (email, username, name, bio, website, banner, etc.)
router.put("/profile", authRequired, updateProfile);

// Search users
router.get("/users/search", authOptional, searchUsers);

// Public profile lookup by username
router.get("/users/:username/profile", authOptional, getProfilePublic);

/* =========================================
   FOLLOW SYSTEM
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

// "Ratings" now come from diary_entries.rating + rating-only reviews (no ratings table)
router.get("/users/:username/ratings", authOptional, getUserRatings);

router.get("/users/:username/reviews", authOptional, getUserReviews);
router.get("/users/:username/playlists", authOptional, getUserPlaylists);
router.get("/users/:username/diary", authOptional, getUserDiary);
router.get("/users/:username/favorites", authOptional, getUserFavorites);
router.get("/users/:username/activity", authOptional, getUserActivity);
router.get("/users/:username/stats", authOptional, getUserStats);
router.get("/users/:username/picture", authOptional, getUserPicture);

/* =========================================
   OPTIONAL: FULL PROFILE BUNDLE
   ========================================= */

router.get("/users/:username/full", authOptional, getFullProfile);

module.exports = router;

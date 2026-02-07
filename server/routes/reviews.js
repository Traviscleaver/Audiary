// server/routes/review.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  upsertReview,
  getReviewById,
  listReviewsForSong,
  listReviewsForAlbum,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} = require("../controllers/reviewController");

// Lists (must come before /:reviewId to avoid route conflicts)
router.get("/songs/:songId", authOptional, listReviewsForSong);
router.get("/albums/:albumId", authOptional, listReviewsForAlbum);

// Create/Upsert
router.post("/", authRequired, upsertReview);

// Likes
router.post("/:reviewId/like", authRequired, likeReview);
router.delete("/:reviewId/like", authRequired, unlikeReview);

// Read single
router.get("/:reviewId", authOptional, getReviewById);

// Update/Delete (owner)
router.put("/:reviewId", authRequired, updateReview);
router.delete("/:reviewId", authRequired, deleteReview);

module.exports = router;

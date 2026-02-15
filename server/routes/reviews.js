// server/routes/review.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  upsertReview,
  getReviewById,
  listReviewsForSong,
  listTopReviewsWeekly, // ✅
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} = require("../controllers/reviewController");

// ✅ Put specific routes BEFORE "/:reviewId"
router.get("/top", authOptional, listTopReviewsWeekly);
router.get("/songs/:songId", authOptional, listReviewsForSong);

// Create/Upsert
router.post("/", authRequired, upsertReview);

// Likes
router.post("/:reviewId/like", authRequired, likeReview);
router.delete("/:reviewId/like", authRequired, unlikeReview);

// Read single (must be after /top)
router.get("/:reviewId", authOptional, getReviewById);

// Update/Delete (owner)
router.put("/:reviewId", authRequired, updateReview);
router.delete("/:reviewId", authRequired, deleteReview);

module.exports = router;

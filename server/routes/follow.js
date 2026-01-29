const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

const {
  followUser,
  unfollowUser,
} = require("../controllers/followController");  // <-- you'll get this file next

// Follow someone
router.post("/users/:username/follow", authRequired, followUser);

// Unfollow someone
router.delete("/users/:username/follow", authRequired, unfollowUser);


module.exports = router;

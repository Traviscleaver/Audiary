// routes/profileBlocks.js
const express = require("express");
const router = express.Router();

const authRequired = require("../middleware/authRequired");

const {
  getMyProfileBlocks,
  createProfileBlock,
  updateProfileBlock,
  reorderProfileBlocks,
  deleteProfileBlock,
} = require("../controllers/profileBlocksController");

// List my blocks (ordered)
router.get("/profile/blocks", authRequired, getMyProfileBlocks);

// Create a block
router.post("/profile/blocks", authRequired, createProfileBlock);

// Update a block (display/rank)
router.patch("/profile/blocks/:id", authRequired, updateProfileBlock);

// Bulk reorder
router.post("/profile/blocks/reorder", authRequired, reorderProfileBlocks);

// Delete a block
router.delete("/profile/blocks/:id", authRequired, deleteProfileBlock);

module.exports = router;

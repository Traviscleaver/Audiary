const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me
} = require("../controllers/authController");

const authRequired = require("../middleware/authRequired");
const authOptional = require("../middleware/authOptional");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);

module.exports = router;

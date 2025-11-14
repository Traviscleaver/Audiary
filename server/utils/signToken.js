const jwt = require("jsonwebtoken");

const JWT_TTL = "15d";

module.exports = function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_TTL });
};

const jwt = require("jsonwebtoken");

function parseAuthHeader(req) {
  const hdr = req.headers.authorization || "";
  const [scheme, token] = hdr.split(" ");
  if (scheme === "Bearer" && token) return token;
  return null;
}

module.exports = function authRequired(req, res, next) {
  const token = parseAuthHeader(req);
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

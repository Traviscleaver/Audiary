const jwt = require("jsonwebtoken");

function parseAuthHeader(req) {
  const hdr = req.headers.authorization || "";
  const [scheme, token] = hdr.split(" ");
  if (scheme === "Bearer" && token) return token;
  return null;
}

module.exports = function authOptional(req, _res, next) {
  const token = parseAuthHeader(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}
  next();
};

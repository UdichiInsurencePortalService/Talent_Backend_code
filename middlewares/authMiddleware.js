const jwt = require("jsonwebtoken");
const usersModel = require("../Model/usersModel");

const COOKIE_NAME = process.env.COOKIE_NAME;

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ USE ID, NOT EMAIL
    const user = await usersModel.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuth };

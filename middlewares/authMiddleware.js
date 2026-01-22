const jwt = require("jsonwebtoken");
const usersModel = require("../Model/usersModel");

const COOKIE_NAME = process.env.COOKIE_NAME || "ta_token";

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usersModel.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { requireAuth };

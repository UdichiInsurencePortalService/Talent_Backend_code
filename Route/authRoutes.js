const express = require("express");
const router = express.Router();

// ✅ CORRECT IMPORT (MOST IMPORTANT LINE)
const authController = require("../Controller/authController");

// ✅ AUTH MIDDLEWARE
const { requireAuth } = require("../middlewares/authMiddleware");

// ---------- ROUTES ----------

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ message: "Logged out successfully" });
});

// Reset password (protected)
router.post("/reset-password", requireAuth, authController.resetPassword);

// ✅ AUTH ME (protected)
router.get("/me", requireAuth, authController.authMe);

module.exports = router;

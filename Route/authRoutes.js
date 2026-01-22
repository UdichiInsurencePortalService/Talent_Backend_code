const express = require("express");
const router = express.Router();

const authController = require("../Controller/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Signup (disabled internally)
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });
  res.json({ message: "Logged out successfully" });
});

// Reset password
router.post("/reset-password", requireAuth, authController.resetPassword);

// Auth me
router.get("/me", requireAuth, authController.authMe);

module.exports = router;

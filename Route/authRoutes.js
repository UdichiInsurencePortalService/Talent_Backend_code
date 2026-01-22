const express = require("express");
const router = express.Router();

const authController = require("../Controller/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });
  res.json({ message: "Logged out" });
});

router.post("/reset-password", requireAuth, authController.resetPassword);
router.get("/me", requireAuth, authController.authMe);

module.exports = router;

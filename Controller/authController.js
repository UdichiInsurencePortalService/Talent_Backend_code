const bcrypt = require("bcrypt");
const usersModel = require("../Model/usersModel");
const { createJWT } = require("../Token/tokens");

const COOKIE_NAME = process.env.COOKIE_NAME || "ta_token";

// ❌ Signup disabled
const signup = async (req, res) => {
  return res.status(403).json({
    error: "Admin signup is disabled"
  });
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createJWT({
      sub: user.id,
      is_admin: user.is_admin
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,        // REQUIRED on Render
      sameSite: "none",    // REQUIRED for Vercel
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password required" });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);
    await usersModel.updatePassword(req.user.id, password_hash);

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ AUTH ME
const authMe = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      is_admin: req.user.is_admin
    }
  });
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  signup,
  login,
  resetPassword,
  authMe
};

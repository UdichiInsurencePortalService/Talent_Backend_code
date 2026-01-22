const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const usersModel = require('../Model/usersModel');
const { createJWT } = require('../Token/tokens');

const COOKIE_NAME = process.env.COOKIE_NAME || 'ta_token';

// SIGNUP (only admin creation)
// ❌ DISABLED SIGNUP (ADMIN CREATION LOCKED)
async function signup(req, res) {
  return res.status(403).json({
    error: "Admin signup is disabled. Contact system administrator."
  });
}


// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = createJWT({ sub: user.id, is_admin: user.is_admin });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 86400000 // 1 day
    });

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// RESET PASSWORD (ADMIN ONLY, no email needed)
async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ error: "New password required" });

    const userId = req.user.id; // from JWT middleware

    const password_hash = await bcrypt.hash(newPassword, 12);
    await usersModel.updatePassword(userId, password_hash);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }


}
// AUTH ME (get logged-in admin details)
async function authMe(req, res) {
  try {
    // req.user is set by requireAuth middleware
    const user = req.user;

    // extra safety
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // return safe fields only
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        created_at: user.created_at,
      }
    });
  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = { signup, login, resetPassword,authMe };

const bcrypt = require("bcrypt");
const usersModel = require("../Model/usersModel");
const { createJWT } = require("../Token/tokens");

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = createJWT({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    });

    // ✅ SEND TOKEN TO FRONTEND
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// AUTH ME
async function authMe(req, res) {
  res.json({
    user: req.user,
  });
}

module.exports = { login, authMe };

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function randomTokenString(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex'); // plain token to email
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex'); // stored in DB
}

module.exports = { createJWT, verifyJWT, randomTokenString, hashToken };

// routes/demo.js
const express = require('express');
const router = express.Router();
const pool = require('../Model/postgressdb'); // <- adjust path

// GET /api/demo/questions
// Returns 5 random questions WITHOUT correct_option
router.get('/', async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT id, question, option_a, option_b, option_c, option_d
      FROM demo_questions
      ORDER BY RANDOM()
      LIMIT 5
    `);

    return res.json({ success: true, questions: q.rows });
  } catch (err) {
    console.error('GET /api/demo/questions error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

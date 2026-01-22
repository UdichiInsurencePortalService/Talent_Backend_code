const pool = require("../Model/postgressdb");
const { sendExamLink } = require("../utils/sendExamLink");

exports.sendExamToCandidates = async (req, res) => {
  const { exam_code } = req.body;

  if (!exam_code) {
    return res.status(400).json({ error: "Exam code required" });
  }

  // Get candidates WITH email
  const result = await pool.query(
    "SELECT email FROM candidates WHERE email IS NOT NULL"
  );

  if (!result.rows.length) {
    return res.status(404).json({ error: "No candidate emails found" });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  for (const c of result.rows) {
    // Save access record
    await pool.query(
      `INSERT INTO exam_access (exam_code, email, expires_at)
       VALUES ($1,$2,$3)
       ON CONFLICT (exam_code,email) DO NOTHING`,
      [exam_code, c.email, expiresAt]
    );

    // Send email
    await sendExamLink({
      email: c.email,
      examCode: exam_code,
      expiresAt,
    });
  }

  res.json({
    success: true,
    sent: result.rows.length,
    expires_at: expiresAt,
  });
};

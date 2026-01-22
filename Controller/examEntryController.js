const pool = require("../Model/postgressdb");

exports.validateExamEntry = async (req, res) => {
  const { exam_code, email } = req.body;

  const result = await pool.query(
    `SELECT * FROM exam_access
     WHERE exam_code=$1 AND email=$2`,
    [exam_code, email]
  );

  if (!result.rows.length) {
    return res.status(403).json({ error: "Invalid exam link" });
  }

  const access = result.rows[0];

  if (access.is_used) {
    return res.status(403).json({ error: "Exam already attempted" });
  }

  if (new Date() > access.expires_at) {
    return res.status(403).json({ error: "Exam link expired" });
  }

  // mark as used
  await pool.query(
    "UPDATE exam_access SET is_used=true WHERE id=$1",
    [access.id]
  );

  res.json({ success: true });
};

const pool = require("../Model/postgressdb");

exports.upsertSession = async (examCode, userId, type) => {
  await pool.query(
    `
    INSERT INTO exam_live_seddions (exam_code, user_id, last_event)
    VALUES ($1, $2, $3)
    ON CONFLICT (exam_code, user_id)
    DO UPDATE SET
      last_event = $3,
      warnings = exam_live_seddions.warnings +
        CASE WHEN $3 = 'warning' THEN 1 ELSE 0 END,
      updated_at = CURRENT_TIMESTAMP
    `,
    [examCode, userId, type]
  );
};

exports.getLiveSessions = async (examCode) => {
  const res = await pool.query(
    `
    SELECT user_id, warnings, last_event
    FROM exam_live_seddions
    WHERE exam_code = $1 AND is_active = true
    `,
    [examCode]
  );
  return res.rows;
};

const pool = require("../Model/postgressdb");

exports.getOrCreateSubject = async (subjectName) => {
  const insert = await pool.query(
    `INSERT INTO subjects (subject_name)
     VALUES ($1)
     ON CONFLICT (subject_name) DO NOTHING
     RETURNING id`,
    [subjectName]
  );

  if (insert.rows.length > 0) {
    return insert.rows[0].id;
  }

  const existing = await pool.query(
    "SELECT id FROM subjects WHERE subject_name = $1",
    [subjectName]
  );

  return existing.rows[0].id;
};

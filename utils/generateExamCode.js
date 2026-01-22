const pool = require("../Model/postgressdb");

async function generateExamCode(subjectId, subjectName) {
  if (!subjectName) {
    throw new Error("subjectName is undefined");
  }

  const subjectKey = subjectName
    .toLowerCase()
    .replace(/\s+/g, "_");

  const result = await pool.query(
    "SELECT COUNT(*) FROM exams WHERE subject_id = $1",
    [subjectId]
  );

  const nextNumber = String(
    Number(result.rows[0].count) + 1
  ).padStart(2, "0");

  return `talent_${subjectKey}_${nextNumber}`;
}

module.exports = generateExamCode;

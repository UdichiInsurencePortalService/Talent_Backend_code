const pool = require("./postgressdb");

/* BULK INSERT */
exports.insertCandidates = async (candidates) => {
  const query = `
    INSERT INTO candidates
    (full_name, father_name, aadhar_number, job_role, email, institution_name)
    VALUES ($1,$2,$3,$4,$5,$6)
  `;

  for (const c of candidates) {
    await pool.query(query, [
      c.full_name,
      c.father_name || null,
      c.aadhar_number || null,
      c.job_role || null,
      c.email || null,              // ✅ allow empty
      c.institution_name || null,
    ]);
  }
};

exports.getAllCandidates = async () => {
  const result = await pool.query(
    "SELECT * FROM candidates ORDER BY id ASC"
  );
  return result.rows;
};

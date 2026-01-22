const pool = require("../Model/postgressdb");

/*
|--------------------------------------------------------------------------
| Create Exam (ONE TIME PER PDF)
|--------------------------------------------------------------------------
| Stores exam details and generated exam_code
| Returns exam_id (integer)
*/
exports.createExam = async (examName, subjectId, duration, examCode) => {
  const result = await pool.query(
    `INSERT INTO exams (exam_name, subject_id, duration, exam_code)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [examName, subjectId, duration, examCode]
  );

  return result.rows[0].id; // ✅ Always return integer exam_id
};


/*
|--------------------------------------------------------------------------
| Get Exam By Exam Code
|--------------------------------------------------------------------------
| Used when student enters exam code
*/
exports.getExamByCode = async (examCode) => {
  const result = await pool.query(
    `SELECT id, exam_name, subject_id, duration, exam_code
     FROM exams
     WHERE exam_code = $1`,
    [examCode]
  );

  return result.rows[0]; // undefined if not found
};


exports.getAllExams = async () => {
  const result = await pool.query(
    `SELECT exam_name, exam_code, subject_id
     FROM exams
     ORDER BY id DESC`
  );

  return result.rows;
};


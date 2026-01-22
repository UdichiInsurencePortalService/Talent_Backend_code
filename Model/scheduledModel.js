const pool = require("./postgressdb");

/*
|--------------------------------------------------------------------------
| Create Scheduled Exam
|--------------------------------------------------------------------------
*/
exports.createScheduledExam = async (data) => {
  const {
    exam_code,
    exam_name,
    subject_name,
    exam_date,
    exam_time,
    duration_minutes,
    assessor_name,
  } = data;

  const result = await pool.query(
    `INSERT INTO scheduled_exams
     (exam_code, exam_name, subject_name, exam_date, exam_time, duration_minutes, assessor_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      exam_code,
      exam_name,
      subject_name,
      exam_date,
      exam_time,
      duration_minutes,
      assessor_name,
    ]
  );

  return result.rows[0];
};

/*
|--------------------------------------------------------------------------
| Get All Scheduled Exams
|--------------------------------------------------------------------------
*/


exports.getAllScheduledExams = async () => {
  const result = await pool.query(`
    SELECT *,
    CASE
      WHEN NOW() < (
        make_timestamp(
          EXTRACT(YEAR FROM exam_date)::int,
          EXTRACT(MONTH FROM exam_date)::int,
          EXTRACT(DAY FROM exam_date)::int,
          EXTRACT(HOUR FROM exam_time)::int,
          EXTRACT(MINUTE FROM exam_time)::int,
          0
        )
      )
      THEN 'UPCOMING'

      WHEN NOW() BETWEEN
        make_timestamp(
          EXTRACT(YEAR FROM exam_date)::int,
          EXTRACT(MONTH FROM exam_date)::int,
          EXTRACT(DAY FROM exam_date)::int,
          EXTRACT(HOUR FROM exam_time)::int,
          EXTRACT(MINUTE FROM exam_time)::int,
          0
        )
        AND
        make_timestamp(
          EXTRACT(YEAR FROM exam_date)::int,
          EXTRACT(MONTH FROM exam_date)::int,
          EXTRACT(DAY FROM exam_date)::int,
          EXTRACT(HOUR FROM exam_time)::int,
          EXTRACT(MINUTE FROM exam_time)::int,
          0
        ) + (duration_minutes || ' minutes')::interval
      THEN 'ONGOING'

      ELSE 'COMPLETED'
    END AS status
    FROM scheduled_exams
    ORDER BY exam_date ASC, exam_time ASC
  `);

  return result.rows;
};



/*
|--------------------------------------------------------------------------
| Get Scheduled Exam By Exam Code
|--------------------------------------------------------------------------
*/
exports.getScheduledExamByCode = async (examCode) => {
  const result = await pool.query(
    `SELECT *
     FROM scheduled_exams
     WHERE exam_code = $1`,
    [examCode]
  );

  return result.rows[0];
};

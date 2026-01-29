const pool = require("./postgressdb");

exports.getExamCenter = async (exam_code, institution_name) => {
  const result = await pool.query(
    `SELECT center_lat, center_lng, allowed_radius
     FROM scheduled_exams
     WHERE exam_code = $1 AND institution_name = $2`,
    [exam_code, institution_name]
  );
  return result.rows[0];
};

exports.saveAttendance = async (data) => {
  const {
    exam_code,
    institution_name,
    full_name,
    father_name,
    mobile_number,
    aadhar_number,
    photo_path,
    candidate_lat,
    candidate_lng,
    distance_meters,
    attendance_status,
  } = data;

  await pool.query(
    `INSERT INTO attendance
     (exam_code, institution_name, full_name, father_name,
      mobile_number, aadhar_number, photo_path,
      candidate_lat, candidate_lng, distance_meters, attendance_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      exam_code,
      institution_name,
      full_name,
      father_name,
      mobile_number,
      aadhar_number,
      photo_path,
      candidate_lat,
      candidate_lng,
      distance_meters,
      attendance_status,
    ]
  );
};
exports.getAllAttendance = async () => {
  const result = await pool.query(`
    SELECT
      id,
      exam_code,
      institution_name,
      full_name,
      father_name,
      mobile_number,
      aadhar_number,
      photo_path,
      candidate_lat,
      candidate_lng,
      distance_meters,
      attendance_status,
      created_at
    FROM attendance
    ORDER BY created_at DESC
  `);

  return result.rows;
};

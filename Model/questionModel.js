const pool = require("./postgressdb")

// questionModel.js

exports.saveQuestions = async (questions) => {
  for (const q of questions) {
    await pool.query(
      `INSERT INTO questions
      (exam_id, exam_code, question_text, option_a, option_b, option_c, option_d, correct_option,language_code)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        q.exam_id,
        q.exam_code,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.language_code
      ]
    );
  }
};

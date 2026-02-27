const pool = require("../Model/postgressdb");

const submitExam = async (req, res) => {
  try {
    const {
      exam_code,
      candidate_name,
      father_name,
      mobile_number,
      language,
      answers,
      time_taken,
      reason,
    } = req.body;

    if (!exam_code || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Get only submitted question IDs
    const questionIds = Object.keys(answers);

    if (questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No answers submitted",
      });
    }

    // 2️⃣ Fetch correct answers ONLY for submitted questions
    const resultQuery = await pool.query(
      `SELECT id, correct_option
       FROM questions
       WHERE id = ANY($1::int[])`,
      [questionIds]
    );

    const dbQuestions = resultQuery.rows;

    let obtained_marks = 0;

    dbQuestions.forEach((q) => {
      const studentAnswer = answers[q.id];

      if (
        studentAnswer &&
        studentAnswer.toLowerCase() ===
          q.correct_option.toLowerCase()
      ) {
        obtained_marks += 4;
      }
    });

    // 3️⃣ Calculate total marks properly
    const total_marks = questionIds.length * 4;

    const result =
      obtained_marks >= total_marks / 2 ? "PASS" : "FAIL";

    // 4️⃣ Insert into DB
    await pool.query(
      `INSERT INTO exam_results
      (exam_code, candidate_name, father_name, mobile_number,
       language, total_marks, obtained_marks, result,
       answers, time_taken, reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        exam_code,
        candidate_name,
        father_name,
        mobile_number,
        language,
        total_marks,
        obtained_marks,
        result,
        JSON.stringify(answers),
        time_taken,
        reason,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { submitExam };
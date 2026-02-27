const pool = require("../Model/postgressdb");

/* ================= SUBMIT EXAM ================= */
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

    const questionIds = Object.keys(answers);

    if (questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No answers submitted",
      });
    }

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

    const total_marks = questionIds.length * 4;

    const result =
      obtained_marks >= total_marks / 2 ? "PASS" : "FAIL";

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
      data: {
        total_marks,
        obtained_marks,
        result,
      },
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ================= GET ALL RESULTS ================= */
const getAllResults = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM exam_results
       ORDER BY submitted_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ================= GET RESULT BY MOBILE ================= */
const getResultByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    const result = await pool.query(
      `SELECT * FROM exam_results
       WHERE mobile_number = $1
       ORDER BY submitted_at DESC`,
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  submitExam,
  getAllResults,
  getResultByMobile,
};
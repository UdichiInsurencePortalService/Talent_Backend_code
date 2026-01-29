const pool = require("../Model/postgressdb");
const generateResultPDF = require("../utils/generateResultPDF");
const sendResultMail = require("../utils/sendResultMail");

exports.submitExam = async (req, res) => {
  try {
    const {
      exam_code,
      language_code,
      candidate_name,
      father_name,
      mobile_number,
      answers,
      time_taken_minutes,
    } = req.body;

    if (!exam_code || !language_code || !candidate_name || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const scheduled = await pool.query(
      `SELECT exam_date, exam_time, assessor_name
       FROM scheduled_exams
       WHERE exam_code = $1`,
      [exam_code]
    );

    if (!scheduled.rows.length) {
      return res.status(404).json({ error: "Exam not scheduled" });
    }

    const meta = scheduled.rows[0];

    const qRes = await pool.query(
      `SELECT id, correct_option
       FROM questions
       WHERE exam_code = $1 AND language_code = $2`,
      [exam_code, language_code]
    );

    let correct = 0;
    let attempted = 0;

    qRes.rows.forEach((q) => {
      const selected = answers[String(q.id)];
      if (selected) {
        attempted++;
        if (selected === q.correct_option) correct++;
      }
    });

    const total = qRes.rows.length;
    const percentage = Math.round((correct / total) * 100);
    const result_status = percentage >= 60 ? "PASS" : "FAIL";

    const resultData = {
      candidate_name,
      father_name,
      mobile_number,
      exam_code,
      language_code,
      total_questions: total,
      attempted_questions: attempted,
      correct_answers: correct,
      percentage,
      result_status,
      time_taken_minutes,
      exam_date: meta.exam_date,
      exam_time: meta.exam_time,
    };

    // ✅ SEND RESPONSE FIRST (CRITICAL)
    res.json({
      success: true,
      percentage,
      result: result_status,
    });

    // ================= OPTIONAL EMAIL (SAFE) =================
    try {
      const pdfPath = await generateResultPDF(resultData);
      await sendResultMail(pdfPath);
    } catch (mailErr) {
      console.error("EMAIL FAILED (ignored):", mailErr.message);
    }
    // =========================================================

  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({ error: "Submission failed" });
  }
};

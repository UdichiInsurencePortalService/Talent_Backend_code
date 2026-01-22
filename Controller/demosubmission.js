const { demosubmission } = require('../Model/submitdemo');

// Controller to calculate result & save
async function submitDemo(req, res) {
  try {
    const payload = req.body;

    // === extract answers array ===
    const answers = payload.answers || [];  

    let score = 0;
    let total = 0;

    // === calculate scoring logic ===
    answers.forEach(ans => {
      if (ans.type === 'mcq') {
        total += 2;

        // auto-check MCQ
        if (ans.selected === ans.correct_answer) {
          score += 2;
        }
      }

      if (ans.type === 'descriptive') {
        total += 5;
        // descriptive is not auto-graded, so add 0 to score
      }
    });

    // === prepare data for DB ===
    const data = {
      duration_seconds: payload.duration_seconds || 0,
      canceled: payload.canceled || false,
      score,
      total
    };

    // === save to DB ===
    const inserted = await demosubmission(data);

    return res.json({
      success: true,
      examId: inserted.id,
      score,
      total
    });
  } catch (error) {
    console.error("submitDemo Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = { submitDemo };

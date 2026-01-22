const pool = require("../Model/postgressdb")
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const csvParser = require("csv-parser");

const generateExamCode = require("../utils/generateExamCode");
const examModel = require("../Model/examModel");
const { getOrCreateSubject } = require("../Model/subjectModel");
const { saveQuestions } = require("../Model/questionModel");

/* ----------------------------------------
   PDF QUESTION PARSER
---------------------------------------- */
function parseQuestions(text, examId, examCode) {
  const questions = [];

  const cleanText = text
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ");

  const regex =
    /Q\d+\.?\s*(.*?)\s*A[\).]\s*(.*?)\s*B[\).]\s*(.*?)\s*C[\).]\s*(.*?)\s*D[\).]\s*(.*?)\s*(Answer|Ans|Correct)[\s:.-]*([A-Da-d])/gi;

  let match;
  while ((match = regex.exec(cleanText)) !== null) {
    questions.push({
      exam_id: examId,
      exam_code: examCode,
      question_text: match[1].trim(),
      option_a: match[2].trim(),
      option_b: match[3].trim(),
      option_c: match[4].trim(),
      option_d: match[5].trim(),
      correct_option: match[7].toUpperCase(),
    });
  }

  return questions;
}

/* ----------------------------------------
   CREATE EXAM (PDF / XLSX / CSV / JSON)
---------------------------------------- */
exports.createExamWithPdf = async (req, res) => {
  let filePath;

  try {
    const { examName, subjectName, duration } = req.body;

    if (!examName || !subjectName || !duration || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // 1️⃣ Subject
    const subjectId = await getOrCreateSubject(subjectName);

    // 2️⃣ Exam Code
    const examCode = await generateExamCode(subjectId, subjectName);

    // 3️⃣ Create Exam
    const examId = await examModel.createExam(
      examName,
      subjectId,
      duration,
      examCode
    );

    let questions = [];

    /* ================= PDF ================= */
    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      questions = parseQuestions(pdfData.text, examId, examCode);
    }

    /* ================= EXCEL ================= */
   /* ================= EXCEL ================= */
else if (ext === ".xlsx") {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  questions = rows.map(row => {
    const normalized = {};

    Object.keys(row).forEach(key => {
      normalized[key.trim().toLowerCase()] = String(row[key]).trim();
    });

    return {
      exam_id: examId,
      exam_code: examCode,
      question_text: normalized.question_text,
      option_a: normalized.option_a,
      option_b: normalized.option_b,
      option_c: normalized.option_c,
      option_d: normalized.option_d,
      correct_option: normalized.correct_option?.toUpperCase(),
      language_code: normalized.language_code || "en", // ✅ FIX

    };
  });
}

/* ================= CSV ================= */
else if (ext === ".csv") {
  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", data => rows.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  questions = rows.map(row => {
    const normalized = {};

    Object.keys(row).forEach(key => {
      normalized[key.trim().toLowerCase()] = String(row[key]).trim();
    });

    return {
      exam_id: examId,
      exam_code: examCode,
      question_text: normalized.question_text,
      option_a: normalized.option_a,
      option_b: normalized.option_b,
      option_c: normalized.option_c,
      option_d: normalized.option_d,
      correct_option: normalized.correct_option?.toUpperCase(),
    language_code: normalized.language_code?.trim() || "en", // ✅ FIX

    };
  });
}


    /* ================= JSON ================= */
    else if (ext === ".json") {
      const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));

      questions = rows.map(row => ({
        exam_id: examId,
        exam_code: examCode,
        question_text: row.question_text,
        option_a: row.option_a,
        option_b: row.option_b,
        option_c: row.option_c,
        option_d: row.option_d,
        correct_option: row.correct_option.toUpperCase(),
        language_code: row.language_code || "en", // ✅ AUTO DEFAULT
      }));
    }

    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    /* ===== VALIDATION ===== */
    if (
  !questions.length ||
  questions.some(q =>
    !q.question_text ||
    !q.option_a ||
    !q.option_b ||
    !q.option_c ||
    !q.option_d ||
    !q.correct_option ||
    !q.language_code
  )
) {
  return res.status(400).json({
    error: "Invalid file format. Check column names & values.",
  });
}


    // 4️⃣ Save Questions
    await saveQuestions(questions);

    // 5️⃣ Delete File
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      examCode,
      totalQuestions: questions.length,
    });

  } catch (err) {
    console.error("CREATE EXAM ERROR:", err);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({ error: err.message });
  }
};


// --------------------------------------------------
// GET EXAM BY EXAM CODE
// --------------------------------------------------
exports.getExamByCode = async (req, res) => {
  try {
    const { examCode } = req.params;

    if (!examCode) {
      return res.status(400).json({
        error: "Exam code is required",
      });
    }

    const exam = await examModel.getExamByCode(examCode);

    if (!exam) {
      return res.status(404).json({
        error: "Invalid exam code",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("GET EXAM ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch exam",
    });
  }
};

// --------------------------------------------------
// GET ALL EXAMS
// --------------------------------------------------
exports.getAllExams = async (req, res) => {
  try {
    const exams = await examModel.getAllExams();

    res.status(200).json({
      success: true,
      total: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("GET ALL EXAMS ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch exams",
    });
  }
};
exports.getQuestionsByLanguage = async (req, res) => {
  const { examCode } = req.params;
  const lang = req.query.lang || "en";

  const result = await pool.query(
    `SELECT question_text, option_a, option_b, option_c, option_d
     FROM questions
     WHERE exam_code=$1 AND language_code=$2
     ORDER BY id ASC`,
    [examCode, lang]
  );

  res.json({ success: true, data: result.rows });
};

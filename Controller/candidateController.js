const xlsx = require("xlsx");
const candidatesModel = require("../Model/candidateModel");

exports.uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File required" });
    }

    let rows = [];

    /* -------- EXCEL -------- */
    if (
      req.file.mimetype.includes("spreadsheet") ||
      req.file.originalname.endsWith(".xlsx")
    ) {
      const workbook = xlsx.read(req.file.buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
    }

    /* -------- JSON -------- */
    else if (req.file.mimetype.includes("json")) {
      rows = JSON.parse(req.file.buffer.toString());
    }

    if (!rows.length) {
      return res.status(400).json({ error: "File is empty" });
    }

    /* -------- NORMALIZE KEYS -------- */
    const candidates = rows.map((r) => {
      const row = {};
      Object.keys(r).forEach((k) => {
        row[k.trim().toLowerCase()] = String(r[k]).trim();
      });

      return {
        full_name: row.full_name,
        father_name: row.father_name,
        aadhar_number: row.aadhar_number,
        job_role: row.job_role,
        email: row.email || null,                 // ✅ allow empty
        institution_name: row.institution_name,
      };
    });

    /* -------- ONLY REQUIRED FIELD -------- */
    if (candidates.some(c => !c.full_name)) {
      return res.status(400).json({
        error: "full_name column is required"
      });
    }

    /* -------- INSERT ALL -------- */
    await candidatesModel.insertCandidates(candidates);

    res.json({
      success: true,
      inserted: candidates.length,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidates = async (req, res) => {
  const data = await candidatesModel.getAllCandidates();
  res.json({ success: true, data });
};

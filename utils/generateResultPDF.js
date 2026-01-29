const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

module.exports = async function generateResultPDF(result) {
  const TMP_DIR = path.join(__dirname, "../tmp");
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const filePath = path.join(TMP_DIR, `result_${Date.now()}.pdf`);
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  /* ================= HEADER ================= */
  const logoPath = path.join(__dirname, "../assets/logo.png"); // optional

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 70 });
  }

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Talent & Skill Assessment", 0, 50, {
      align: "center",
    });

  doc
    .moveDown(0.5)
    .fontSize(12)
    .font("Helvetica")
    .text("Candidate Examination Result", {
      align: "center",
    });

  doc.moveDown(2);

  /* ================= CANDIDATE DETAILS ================= */
  doc.font("Helvetica-Bold").text("Candidate Details");
  doc.moveDown(0.5);

  drawTable(doc, [
    ["Candidate Name", result.candidate_name],
    ["Father Name", result.father_name],
    ["Mobile Number", result.mobile_number],
    ["Exam Code", result.exam_code],
    ["Language", result.language_code.toUpperCase()],
    ["Exam Date", result.exam_date || "-"],
    ["Exam Time", result.exam_time || "-"],
  ]);

  doc.moveDown(2);

  /* ================= RESULT DETAILS ================= */
  doc.font("Helvetica-Bold").text("Result Summary");
  doc.moveDown(0.5);

  drawTable(doc, [
    ["Total Questions", result.total_questions],
    ["Attempted Questions", result.attempted_questions],
    ["Correct Answers", result.correct_answers],
    [
      "Score",
      `${result.correct_answers} / ${result.total_questions}`,
    ],
    ["Percentage", `${result.percentage}%`],
    [
      "Result Status",
      result.result_status,
    ],
    ["Time Taken", `${result.time_taken_minutes} minutes`],
  ], result.result_status);

  doc.moveDown(3);

  /* ================= FOOTER ================= */
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "This is a system-generated report. No signature is required.",
      { align: "center" }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

/* ================= TABLE HELPER ================= */
function drawTable(doc, rows, status) {
  const startX = 50;
  let startY = doc.y;
  const col1Width = 180;
  const col2Width = 300;
  const rowPadding = 8;

  rows.forEach(([label, value]) => {
    const labelHeight = doc.heightOfString(label, {
      width: col1Width - 16,
    });

    const valueHeight = doc.heightOfString(String(value), {
      width: col2Width - 16,
    });

    const rowHeight = Math.max(labelHeight, valueHeight) + rowPadding * 2;

    // Result highlight
    if (label === "Result Status") {
      doc
        .rect(startX, startY, col1Width + col2Width, rowHeight)
        .fill(status === "PASS" ? "#dcfce7" : "#fee2e2");
      doc.fillColor("black");
    }

    doc.rect(startX, startY, col1Width, rowHeight).stroke();
    doc.rect(startX + col1Width, startY, col2Width, rowHeight).stroke();

    doc
      .font("Helvetica-Bold")
      .text(label, startX + 8, startY + rowPadding, {
        width: col1Width - 16,
      });

    doc
      .font("Helvetica")
      .text(String(value), startX + col1Width + 8, startY + rowPadding, {
        width: col2Width - 16,
      });

    startY += rowHeight;
  });

  doc.moveDown();
}


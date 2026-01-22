const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

module.exports = async function generateResultPDF(result) {
  const TMP_DIR = path.join(__dirname, "../tmp");

  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const filePath = path.join(
    TMP_DIR,
    `result_${Date.now()}.pdf`
  );

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text("Candidate Examination Result", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Candidate Name: ${result.candidate_name}`);
  doc.text(`Father Name: ${result.father_name}`);
  doc.text(`Mobile Number: ${result.mobile_number}`);
  doc.text(`Exam Code: ${result.exam_code}`);
  doc.text(`Language: ${result.language_code}`);
  doc.text(`Total Questions: ${result.total_questions}`);
  doc.text(`Correct Answers: ${result.correct_answers}`);
  doc.text(`Score: ${result.percentage}%`);
  doc.text(`Result: ${result.result_status}`);
  doc.text(`Time Taken: ${result.time_taken_minutes} minutes`);

  doc.moveDown();
  doc.text("This is a system-generated report.", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

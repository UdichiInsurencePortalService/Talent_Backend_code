

const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function sendResultMail(pdfPath) {
  const pdfBuffer = fs.readFileSync(pdfPath);

  await resend.emails.send({
    from: "Talent & Skill <onboarding@resend.dev>", // ✅ REQUIRED
    to: ["kunalsharma020401@gmail.com"],            // ✅ ONLY YOU
    reply_to: "talentassessoffical@gmail.com",      // ✅ Gmail shown
    subject: "📄 Exam Result Report",
    text: `
Exam Result Generated Successfully.

From: talentassessoffical@gmail.com
Please find the attached PDF report.
`,
    attachments: [
      {
        filename: "exam_result.pdf",
        content: pdfBuffer.toString("base64"),
        type: "application/pdf",
      },
    ],
  });

  fs.unlinkSync(pdfPath);
};

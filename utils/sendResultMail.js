
const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (pdfPath) => {
  const pdf = fs.readFileSync(pdfPath);

  await resend.emails.send({
    from: "Talent & Skill <onboarding@resend.dev>",
    to: ["kunalsharma020401@gmail.com"],
    subject: "📄 Exam Result Report",
    text: "Attached exam result PDF.",
    attachments: [
      {
        filename: "exam_result.pdf",
        content: pdf.toString("base64"),
      },
    ],
  });

  fs.unlinkSync(pdfPath);
};

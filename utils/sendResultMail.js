require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

module.exports = async (pdfPath) => {
  await transporter.sendMail({
    from: `"Talent & Skill Access" <${process.env.EMAIL_USER}>`,
    to: "kunalsharma020401@gmail.com",
    subject: "📄 Exam Result Report",
    text: "Attached exam result PDF.",
    attachments: [
      {
        filename: "exam_result.pdf",
        path: pdfPath,
      },
    ],
  });

  fs.unlinkSync(pdfPath); // cleanup
};

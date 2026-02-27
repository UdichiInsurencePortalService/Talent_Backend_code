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






// const { Resend } = require("resend");
// const fs = require("fs");

// const resend = new Resend(process.env.RESEND_API_KEY);

// module.exports = async function sendResultMail(pdfPath) {
//   const pdfBuffer = fs.readFileSync(pdfPath);

//   await resend.emails.send({
//     from: "Talent & Skill <onboarding@resend.dev>", // ✅ REQUIRED
//     to: ["kunalsharma020401@gmail.com"],            // ✅ ONLY YOU
//     reply_to: "talentassessoffical@gmail.com",      // ✅ Gmail shown
//     subject: "📄 Exam Result Report",
//     text: `
// Exam Result Generated Successfully.

// From: talentassessoffical@gmail.com
// Please find the attached PDF report.
// `,
//     attachments: [
//       {
//         filename: "exam_result.pdf",
//         content: pdfBuffer.toString("base64"),
//         type: "application/pdf",
//       },
//     ],
//   });

//   fs.unlinkSync(pdfPath);
// };

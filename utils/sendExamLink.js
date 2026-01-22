require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // ✅ MUST be true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendExamLink = async ({ email, examCode, expiresAt }) => {
  const link = `${process.env.FRONTEND_URL}/exam-entry?exam_code=${examCode}&email=${email}`;

  await transporter.sendMail({
    from: `"Talent Assessment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎓 Exam Invitation – Talent Assessment",
    html: `
      <div style="font-family:Arial;max-width:600px">
        <h2>Online Exam Invitation</h2>
        <p><b>Exam Code:</b> ${examCode}</p>

        <a href="${link}"
           style="display:inline-block;padding:12px 20px;
                  background:#2563eb;color:#fff;
                  text-decoration:none;border-radius:6px">
          Start Exam
        </a>

        <p>⏰ Valid till: <b>${expiresAt.toLocaleString()}</b></p>
        <p>⚠️ This link can be used only once.</p>

        <hr/>
        <p>Regards,<br/>Talent & Skill Assessment Team</p>
      </div>
    `,
  });
};

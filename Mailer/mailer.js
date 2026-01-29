const nodemailer = require("nodemailer");

let transporter = null;

// ✅ Only create SMTP transporter in LOCAL
if (process.env.NODE_ENV !== "production") {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendMail({ to, subject, html, text }) {
  // ✅ SKIP email on Render
  if (!transporter) {
    console.log("📧 Email skipped (production mode)");
    return;
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };

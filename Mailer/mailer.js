const nodemailer = require("nodemailer");

let transporter = null;

/**
 * ✅ Create SMTP transporter ONLY in local development
 * NODE_ENV !== "production" → localhost
 */
if (process.env.NODE_ENV !== "production") {
  transporter = nodemailer.createTransport({
    service: "gmail", // ✅ Gmail for local
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  console.log("📧 Gmail SMTP enabled (LOCAL)");
} else {
  console.log("📧 Email disabled (PRODUCTION)");
}

/**
 * Send email (works only in local)
 */
async function sendMail({ to, subject, html, text }) {
  // ✅ Skip sending in production (Render)
  if (!transporter) {
    console.log("📧 Email skipped (production mode)");
    return;
  }

  return transporter.sendMail({
    from: `"Talent & Skill Access" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };

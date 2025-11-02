import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM, ADMIN_EMAIL } = process.env;

const isEmailConfigured = Boolean(SMTP_HOST && EMAIL_FROM && ADMIN_EMAIL);

export async function sendInquiryEmail(subject: string, html: string) {
  if (!isEmailConfigured) {
    console.warn("SMTP credentials are not fully configured; skipping email send.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASSWORD ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

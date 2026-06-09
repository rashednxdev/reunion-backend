import nodemailer from 'nodemailer';
import {
  buildApprovalEmailHtml,
  buildApprovalEmailText,
} from '../templates/approvalEmailTemplate.js';

function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

function createTransporter() {
  if (!isEmailConfigured()) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendApprovalConfirmationEmail(registration) {
  if (!registration?.email) {
    return { sent: false, reason: 'No email address on this registration.' };
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — approval email skipped.');
    return { sent: false, reason: 'Email service is not configured on the server.' };
  }

  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/$/, '');
  const ticketUrl = `${frontendUrl}/ticket/${encodeURIComponent(registration.ticketId)}`;
  const registerUrl = `${frontendUrl}/#register`;

  const mailOptions = {
    from: process.env.SMTP_FROM || `"CGA Reunion 2026" <${process.env.SMTP_USER}>`,
    to: registration.email,
    subject: `Registration Approved — Your Reunion Ticket (${registration.ticketId})`,
    html: buildApprovalEmailHtml(registration, { ticketUrl, registerUrl }),
    text: buildApprovalEmailText(registration, { ticketUrl, registerUrl }),
  };

  await transporter.sendMail(mailOptions);

  return { sent: true, to: registration.email };
}

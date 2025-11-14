import nodemailer from "nodemailer";

/**
 * Email Transport Configuration
 *
 * This module configures and exports a Nodemailer transporter for sending emails.
 *
 * Configuration:
 * - Service: Gmail SMTP service
 * - Authentication: Uses Gmail account credentials
 * - Password: Google App Password (not regular Gmail password)
 *
 * To generate a Google App Password:
 * 1. Enable 2-factor authentication on your Google account
 * 2. Go to Google Account > Security > 2-Step Verification > App passwords
 * 3. Generate a new app password for "Mail"
 * 4. Add the generated password to .env as GOOGLE_APP_PASSWORD
 *
 * Usage:
 * Import this transporter and use sendMail() method to send emails.
 *
 * @example
 * transporter.sendMail({
 *   from: '"App Name" <noreply@example.com>',
 *   to: 'user@example.com',
 *   subject: 'Subject',
 *   html: '<p>HTML content</p>'
 * });
 */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

export default transporter;

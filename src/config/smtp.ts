import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "artisandevx@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export default transporter;

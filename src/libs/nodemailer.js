import nodemailer from "nodemailer";
import { NODE_MAILER_API_KEY } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "oquendodev@gmail.com",
    pass: NODE_MAILER_API_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
});

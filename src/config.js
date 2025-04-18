import dotenv from "dotenv";

dotenv.config();
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const PORT = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

export const NODE_MAILER_API_KEY = process.env.NODE_MAILER_API_KEY;

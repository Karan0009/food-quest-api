export const defaultConfig = {
  APP_NAME: process.env.APP_NAME || '',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  DEBUG: process.env.DEBUG || 'false',
  DB_URL: process.env.DB_URL,
  NODEMAILER_EMAIL_HOST: process.env.NODEMAILER_EMAIL_HOST,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_EMAIL_PASSWORD: process.env.NODEMAILER_EMAIL_PASSWORD,
};

/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('dotenv');
const { join } = require('path');

const VALID_ENVS = ['dev', 'testing', 'production'];

function getEnvFilepath(nodeEnv) {
  if (!nodeEnv || !VALID_ENVS.includes(nodeEnv))
    return join(process.cwd(), 'environments', '.env.dev');
  return process.env.NODE_ENV === 'production'
    ? join(process.cwd(), '.env')
    : join(process.cwd(), 'environments', `.env.${nodeEnv}`);
}
config({
  override: true,
  path: getEnvFilepath(process.env.NODE_ENV),
});
const dbConfig = {
  dev: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions:
      process.env.DB_SSL_MODE === 'true'
        ? { ssl: { require: 'true' } }
        : undefined,
  },
  testing: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions:
      process.env.DB_SSL_MODE === 'true'
        ? { ssl: { require: 'true' } }
        : undefined,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions:
      process.env.DB_SSL_MODE === 'true'
        ? { ssl: { require: 'true' } }
        : undefined,
  },
};

module.exports = dbConfig;

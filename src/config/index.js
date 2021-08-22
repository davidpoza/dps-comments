import dotenv from 'dotenv';
const envFound = dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file");
}

export default {
  port: 3000,
  url: process.env.URL,
  debug: process.env.DEBUG === 'true',
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  db: {
    dbname: 'dps-comments',
    username: 'user', // not used on sqlite
    password: 'password',// not used on sqlite
    params: {
      dialect: 'sqlite',
      storage: './data/database.sqlite',
      define: {
        underscored: true
      },
    }
  },
  api: {
    prefix: '/',
  },
  language: 'es',
  jwtLifetime: parseInt(process.env.JWT_LIFETIME, 10) || 86400,
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
};


import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/aamira_tracker',
  apiSecretKey: process.env.API_SECRET_KEY || 'default-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
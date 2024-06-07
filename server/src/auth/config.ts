import * as dotenv from 'dotenv';
dotenv.config();

export const AMOCRM_CONFIG = {
  domain: process.env.DOMAIN,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  code: process.env.CODE,
};

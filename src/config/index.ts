import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV || "development",
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL || "http://localhost:3000",
  api_url: process.env.API_URL || "http://localhost:5000",

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
  stripe_currency: process.env.STRIPE_CURRENCY || "usd",

  ssl_store_id: process.env.SSL_STORE_ID!,
  ssl_store_password: process.env.SSL_STORE_PASSWORD!,
  ssl_is_live: process.env.SSL_IS_LIVE === "true",
  ssl_currency: process.env.SSL_CURRENCY || "BDT",
};


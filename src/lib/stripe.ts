import Stripe from "stripe";
import config from "../config";

if (!config.stripe_secret_key) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables!");
}

export const stripe = new Stripe(config.stripe_secret_key);

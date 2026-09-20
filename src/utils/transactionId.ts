import crypto from "crypto";

// FIX-1737041234567-9F3A2C  -> unique, readable, gateway safe
export const generateTransactionId = (prefix = "FIX") => {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
};

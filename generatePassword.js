import crypto from 'crypto';
export const generateHexCode = (input, keySecret = "default_secret") => {
  return crypto.createHmac("sha256", keySecret).update(input).digest("hex");
};
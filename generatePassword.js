export const generateHexCode = (input, keySecret) => {
  return crypto
    .createHmac('sha256', keySecret) 
    .update(input) 
    .digest('hex'); 
}
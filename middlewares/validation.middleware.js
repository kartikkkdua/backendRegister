import { teamValidator } from "../teamValidation.js";

export const validation = (req, res, next) => {
  const { teamName, email, sapId, phoneNumber, alternateNumber } = req.body;
  const response = teamValidator.safeParse({ teamName, email, sapId, phoneNumber, alternateNumber });
  if(!response.success) {
    return res.status(400).json({ success: false, message: response.error });
  }
  next();
}
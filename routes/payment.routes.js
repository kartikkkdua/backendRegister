import { Router } from "express";
import registerUser from '../controller/payment.controller.js'
import { checkTeamName } from "../middlewares/checkTeamName.middleware.js";
import { validation } from "../middlewares/validation.middleware.js";


const router = Router();

router.route('/createOrder')
  .post(validation, checkTeamName, registerUser)

export default router;
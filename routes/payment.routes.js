import { Router } from "express";
import registerUser from '../controller/payment.controller.js'
import { checkTeamName } from "../middlewares/checkTeamName.middleware.js";


const router = Router();

router.route('/createOrder')
  .post(checkTeamName, registerUser)

export default router;
import { Router } from "express";
import registerUser from '../controller/register.controller.js'

const router = Router();

router.route('/createOrder')
  .post(registerUser)

export default router;
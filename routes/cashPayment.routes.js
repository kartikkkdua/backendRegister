import { Router } from 'express';
import { cashPayment } from '../controller/cashPayment.controller.js'

const router = Router();

router.route('/cashPayment')
  .post(cashPayment)

export default router;
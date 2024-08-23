import {Router} from 'express';
import { verifyAndSave } from '../controller/verifyAndSave.controller.js';

const router = Router();

router.route('/verifyPaymentAndSave')
  .post(verifyAndSave)


export default router;
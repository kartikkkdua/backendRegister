import { Router } from 'express';
import { Team } from '../model/team.model.js';
import { checkPrimeId } from '../controller/checkPrimeId.controller.js'

const router = Router();

router.route('/checkPrimeId')
  .post(checkPrimeId); 

export default router;

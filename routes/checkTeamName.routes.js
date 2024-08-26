import { Router } from "express";
import { handleTeamNameCheck } from '../controller/checkTeamName.controller.js';

const router = Router();

router.route('/checkTeamName')
  .post(handleTeamNameCheck)


export default router;
import { Router } from 'express'
import { findTeams } from '../controller/findTeams.controller.js';

const router = Router()

router.route('/findTeams')
  .post(findTeams)

export default router;
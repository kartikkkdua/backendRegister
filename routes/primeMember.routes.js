import { Router } from 'express';
import {primeMember} from '../controller/primeMember.controller.js';

router.route('/primeMember')
  .post(primeMember)
  
export default router;
import { Router } from 'express';
import { verifyAndSave } from '../controller/verifyAndSave.controller.js';
import { Team } from '../model/team.model.js';
import { Counter } from '../model/counter.model.js';
import { DrishyaEvent, PersonaEvent, ArenaEvent, InnovationEvent } from '../model/event.model.js';

const router = Router();

router.route('/verifyPaymentAndSave')
  .post(verifyAndSave);

export default router;
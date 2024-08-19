import { Router } from "express";

const router = Router();

router.route('/')
  .post(registerUser)


export default router;
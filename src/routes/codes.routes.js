import { Router } from "express";

import {
  sendCode,
  verifyCode,
  resendCode,
} from "../controllers/code.controller.js";

const router = Router();

router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);

export default router;

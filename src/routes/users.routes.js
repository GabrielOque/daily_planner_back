import { Auth } from "../middlewares/auth.js";

import { Router } from "express";

import {
  createUser,
  dumy,
  checkToken,
  signIn,
  changePassword,
  joinMeeting,
  createMeeting,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", signIn);
router.put("/change-password", changePassword);
router.get("/check-token", Auth, checkToken);
router.post("/join-meeting", joinMeeting);
router.post("/create-meeting", createMeeting);
router.post("/dumy", Auth, dumy);

export default router;

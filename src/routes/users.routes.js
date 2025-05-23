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
  searchUserFromEvent,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", signIn);
router.put("/change-password", changePassword);
router.get("/check-token", Auth, checkToken);
router.put("/update-user", Auth, updateUser);
router.get("/search-user-from-event", Auth, searchUserFromEvent);
router.post("/join-meeting", joinMeeting);
router.post("/create-meeting", createMeeting);
router.post("/dumy", Auth, dumy);

export default router;

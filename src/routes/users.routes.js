import { Auth } from "../middlewares/auth.js";

import { Router } from "express";

import { createUser, dumy } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", createUser);
router.post("/dumy", Auth, dumy);

export default router;

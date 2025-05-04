import { Router } from "express";
import { Auth } from "../middlewares/auth.js";

import { createList, getLists } from "../controllers/list.controller.js";

const router = Router();

router.post("/create-list", Auth, createList);
router.get("/get-lists", Auth, getLists);

export default router;

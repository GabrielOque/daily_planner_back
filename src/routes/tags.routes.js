import { Router } from "express";
import { Auth } from "../middlewares/auth.js";

import { createTag, getTags } from "../controllers/tag.controller.js";

const router = Router();

router.post("/create-tag", Auth, createTag);
router.get("/get-tags", Auth, getTags);

export default router;

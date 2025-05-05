import { Router } from "express";
import { Auth } from "../middlewares/auth.js";

import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.contollers.js";

const router = Router();

router.post("/create-note", Auth, createNote);
router.get("/get-notes", Auth, getNotes);
router.put("/update-note/:id", Auth, updateNote);
router.delete("/delete-note/:id", Auth, deleteNote);

export default router;

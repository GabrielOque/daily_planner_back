import { Router } from "express";
import { Auth } from "../middlewares/auth.js";

import {
  createEvent,
  getEvents,
  joinMeeting,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.post("/create-event", Auth, createEvent);
router.get("/get-events", Auth, getEvents);
router.post("/join-meeting", Auth, joinMeeting);
router.put("/update-event/:id", Auth, updateEvent);
router.delete("/delete-event/:id", Auth, deleteEvent);

export default router;

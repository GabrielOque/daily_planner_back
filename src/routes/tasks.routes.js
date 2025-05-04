import { Router } from "express";
import { Auth } from "../middlewares/auth.js";

import {
  createTask,
  getTasksByWeek,
  deleteTask,
  updateTask,
  changeStatus,
  getTasksByList,
  getTasksByTag,
  getAllTasks,
} from "../controllers/task.controllers.js";

const router = Router();

router.post("/create-task", Auth, createTask);
router.get("/get-tasks-by-week", Auth, getTasksByWeek);
router.delete("/delete-task/:id", Auth, deleteTask);
router.put("/update-task/:id", Auth, updateTask);
router.put("/change-status/:id", Auth, changeStatus);
router.get("/get-tasks-by-list/:id", Auth, getTasksByList);
router.get("/get-tasks-by-tag/:id", Auth, getTasksByTag);
router.get("/get-all-tasks", Auth, getAllTasks);

export default router;

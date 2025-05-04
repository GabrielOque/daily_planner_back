import Tasks from "../models/Tasks.js";
import Lists from "../models/Lists.js";
import Tags from "../models/Tags.js";
import { DateTime } from "luxon";
import { uploadFile, deleteFile } from "../libs/cloudinary.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, date, list, tag } = req.body;
    const file = req.files?.file;
    let newFile = { public_id: null, secure_url: null };

    if (file?.data) {
      const folder = `Files/${req.user.name}_${req.user.id}`;
      const { public_id, secure_url } = await uploadFile(file.data, folder);
      newFile = { public_id, secure_url };
    }

    const newTask = await Tasks.create({
      title,
      description,
      date,
      list: list === "null" ? null : list,
      tag: tag === "null" ? null : tag,
      user: req.user.id,
      file: newFile,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const getTasksByWeek = async (req, res) => {
  try {
    const tasks = await Tasks.find({
      user: req.user.id,
      status: { $in: ["PENDING", "INPROGRESS"] },
    })
      .populate("list")
      .populate("tag")
      .sort({ createdAt: -1 });

    const today = [];
    const tomorrow = [];
    const week = [];

    tasks.forEach((task) => {
      const taskDate = DateTime.fromISO(task.date);

      if (taskDate.hasSame(DateTime.local(), "day")) {
        today.push(task);
      } else if (taskDate.hasSame(DateTime.local().plus({ days: 1 }), "day")) {
        tomorrow.push(task);
      } else if (taskDate > DateTime.local().plus({ days: 1 })) {
        week.push(task);
      }
    });

    res.status(200).json({ today, tomorrow, week });
  } catch (error) {
    console.error("Error en getTasksByWeek:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findById(id);

    if (!task) {
      return res.status(404).json({ code: "TASK_NOT_FOUND" });
    }

    if (task?.file?.public_id) {
      await deleteFile(task.file.public_id);
    }

    await Tasks.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error en deleteTask:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, list, tag, status } = req.body;
    const file = req.files?.file;
    let newFile = { public_id: null, secure_url: null };

    if (file?.data) {
      const folder = `Files/${req.user.name}_${req.user.id}`;
      const { public_id, secure_url } = await uploadFile(file.data, folder);
      newFile = { public_id, secure_url };
    }

    const updateFields = {
      title,
      description,
      date,
      list: list === "null" ? null : list,
      tag: tag === "null" ? null : tag,
      status,
    };

    if (("file" in req.body && req.body.file === "null") || file?.data) {
      updateFields.file = newFile;
    }

    const updatedTask = await Tasks.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ code: "TASK_NOT_FOUND" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error en updateTask:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let status = "";

    const task = await Tasks.findById(id);

    if (!task) {
      return res.status(404).json({ code: "TASK_NOT_FOUND" });
    }

    if (task.status === "PENDING") {
      status = "INPROGRESS";
    } else if (task.status === "INPROGRESS") {
      status = "COMPLETED";
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error en changeStatus:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const getTasksByList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await Lists.findById(id);
    const tasks = await Tasks.find({ list: id, user: req.user.id })
      .populate("list")
      .populate("tag")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      list: {
        label: list.label,
        color: list.color,
      },
      tasks,
    });
  } catch (error) {
    console.error("Error en getTasksByList:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const getTasksByTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tags.findById(id);
    const tasks = await Tasks.find({ tag: id, user: req.user.id })
      .populate("list")
      .populate("tag")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      tag: {
        label: tag.label,
        color: tag.color,
      },
      tasks,
    });
  } catch (error) {
    console.error("Error en getTasksByTag:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.user.id })
      .populate("list")
      .populate("tag")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error en getAllTasks:", error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

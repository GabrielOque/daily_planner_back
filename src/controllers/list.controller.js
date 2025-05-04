import Lists from "../models/Lists.js";

export const createList = async (req, res) => {
  const { label, color } = req.body;
  const userId = req.user.id;

  try {
    const newList = await Lists.create({
      label,
      color,
      user: userId,
    });
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const getLists = async (req, res) => {
  const userId = req.user.id;
  try {
    const lists = await Lists.find({ user: userId });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

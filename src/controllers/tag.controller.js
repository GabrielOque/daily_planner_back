import Tags from "../models/Tags.js";

export const createTag = async (req, res) => {
  const { label, color } = req.body;
  const userId = req.user.id;

  try {
    const newTag = await Tags.create({
      label,
      color,
      user: userId,
    });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const getTags = async (req, res) => {
  const userId = req.user.id;
  try {
    const tags = await Tags.find({ user: userId });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

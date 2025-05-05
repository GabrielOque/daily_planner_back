import Notes from "../models/Notes.js";

export const createNote = async (req, res) => {
  const { text, color, date } = req.body;
  const userId = req.user.id;

  try {
    const newNote = await Notes.create({
      text,
      color,
      date,
      user: userId,
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const getNotes = async (req, res) => {
  const userId = req.user.id;

  try {
    const notes = await Notes.find({ user: userId });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ code: "NOTE_NOT_FOUND" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Notes.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ code: "NOTE_NOT_FOUND" });
    }

    res.status(200).json({ code: "NOTE_DELETED" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Note", notesSchema);

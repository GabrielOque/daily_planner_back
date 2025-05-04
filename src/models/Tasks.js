import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "INPROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    date: {
      type: String,
      required: true,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      default: null,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: {
      secure_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);

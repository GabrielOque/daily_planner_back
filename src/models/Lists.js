import mongoose from "mongoose";

const listsSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    color: {
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
export default mongoose.model("List", listsSchema);

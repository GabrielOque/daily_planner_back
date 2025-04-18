import mongoose from "mongoose";

const codesSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
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

export default mongoose.model("Code", codesSchema);

import mongoose from "mongoose";
const eventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    coordinator: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
      required: false,
      default: [],
    },
    startDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventsSchema);

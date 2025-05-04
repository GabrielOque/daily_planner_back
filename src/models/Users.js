import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    secure_url: { type: String, default: null },
    public_id: { type: String, default: null },
  },
});

export default mongoose.model("User", usersSchema);

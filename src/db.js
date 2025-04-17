import mongoose from "mongoose";
import { DB_NAME, DB_PASSWORD, DB_USER } from "./config.js";

const connectDB = async () => {
  const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.epaaf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    const db = await mongoose.connect(URI);
    console.log("Connect to", db.connection.name);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;

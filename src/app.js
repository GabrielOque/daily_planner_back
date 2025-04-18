import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";
import codesRoutes from "./routes/codes.routes.js";

const app = express();

//middleware
app.use(express.json());
app.use(fileUpload());

app.use(
  cors({
    origin: [
      "https://daily-planner-back.onrender.com",
      "https://daily-planner-back-1.onrender.com",
      "http://localhost:4000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/code", codesRoutes);

export default app;

import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";

const app = express();

//middleware
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/api/v1", usersRoutes);

export default app;

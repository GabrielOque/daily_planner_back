import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import tagsRoutes from "./routes/tags.routes.js";
import usersRoutes from "./routes/users.routes.js";
import codesRoutes from "./routes/codes.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import listsRouters from "./routes/lists.routes.js";
import tasksRouters from "./routes/tasks.routes.js";
import notesRoutes from "./routes/notes.routes.js";

const app = express();

//middleware
app.use(express.json());
app.use(fileUpload());

app.use(
  cors({
    origin: [
      "https://test.dailyplanner.site",
      "https://dailyplanner.site",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.options("*", cors());

app.use("/api/v1/tag", tagsRoutes);
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/code", codesRoutes);
app.use("/api/v1/event", eventsRoutes);
app.use("/api/v1/list", listsRouters);
app.use("/api/v1/task", tasksRouters);
app.use("/api/v1/note", notesRoutes);

export default app;

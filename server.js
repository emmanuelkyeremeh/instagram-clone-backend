import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/UserRouter.js";
import PostRouter from "./routes/PostRoutes.js";
import CommentRouter from "./routes/CommentRouter.js";
// import multer from "multer";
// import GridFsStorage from "multer-gridfs-storage";
// import expressAsyncHandler from "express-async-handler";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/posts", PostRouter);
app.use("/api/comments", CommentRouter);

app.use((err, req, res, next) => [
  res.status(500).send({ message: err.message }),
]);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("Connection Successful");
});

app.get("/", (req, res) => {
  res.status(500).send("Server Ready!");
});

app.listen(PORT, () => console.log(`Express Server listening on port ${PORT}`));

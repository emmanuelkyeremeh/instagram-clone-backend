import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/UserRouter.js";
import PostRouter from "./routes/PostRoutes.js";
import CommentRouter from "./routes/CommentRouter.js";
import FollowRouter from "./routes/FollowRoutes.js";
import LikeRouter from "./routes/LikeRouter.js";
import ImageRouter from "./routes/ImageRouter.js";
import Grid from "gridfs-stream";
import http from "http";
import socket from "socket.io";
dotenv.config();

const PORT = process.env.PORT;

const app = express();

const server = http.Server(app);
const io = socket(server);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use("/api/users", userRouter);
app.use("/api/posts", PostRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/follow", FollowRouter);
app.use("/api/like", LikeRouter);
app.use("/api/image", ImageRouter);

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

export let gfs;
export let gridFSBucket;

db.once("open", () => {
  console.log("Connection Successful");

  gridFSBucket = new mongoose.mongo.GridFSBucket(db.db, {
    bucketName: "uploads",
  });

  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
});

io.on("connection", (socket) => {
  socket.on("addPost", (data) => socket.emit("addPost", data));
  socket.on("updatePost", (data) => socket.emit("updatePost", data));
  socket.on("deletePost", (data) => socket.emit("deletePost", data));

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.get("/", (req, res) => {
  res.status(500).send("Server Ready!");
});

app.listen(PORT, () => console.log(`Express Server listening on port ${PORT}`));

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
import { Server } from "socket.io";
dotenv.config();
import Post from "./models/PostModel.js";

const PORT = process.env.PORT;

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

io.on("connection", (socket) => {
  socket.on("addPost", async (post) => {
    const newPost = new Post({
      user: post._id,
      user_username: post.username,
      imageName: post.imageName,
      actualImage: post.actualImage,
      caption: post.caption,
    });

    await newPost.save();
    io.emit("sendPostToClient", newPost);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

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

app.get("/", (req, res) => {
  res.status(500).send("Server Ready!");
});

server.listen(PORT, () => {
  console.log(`Express Server listening on port ${PORT}`);
});

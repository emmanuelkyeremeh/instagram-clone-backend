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
import Pusher from "pusher";
dotenv.config();

const pusher = new Pusher({
  appId: "1177968",
  key: "fafec25bb7f14da1a62c",
  secret: "f1cbd44eeaf5d26db615",
  cluster: "eu",
  useTLS: true,
});

const PORT = process.env.PORT;

const app = express();

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

  const postCollection = db.collection("posts");
  const postChangeStream = postCollection.watch();

  postChangeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const posts = change.fullDocument;
      pusher.trigger("posts", "inserted", {
        _id: posts._id,
        user: posts.user,
        user_username: posts.user_username,
        imageName: posts.imageName,
        actualImage: posts.actualImage,
        caption: posts.caption,
      });
    } else if (change.operationType === "update") {
      const posts = change.fullDocument;
      pusher.trigger("posts", "updated", {
        _id: posts._id,
        user: posts.user,
        user_username: posts.user_username,
        imageName: posts.imageName,
        actualImage: posts.actualImage,
        caption: posts.caption,
      });
    } else if (change.operationType === "delete") {
      pusher.trigger("posts", "deleted", change.documentKey._id);
    }
  });
});

app.get("/", (req, res) => {
  res.status(500).send("Server Ready!");
});

app.listen(PORT, () => console.log(`Express Server listening on port ${PORT}`));

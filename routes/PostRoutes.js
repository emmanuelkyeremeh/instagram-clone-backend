import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../Auth.js";
import Post from "../models/PostModel.js";
import multer from "multer";

const PostRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "../../instagram-clone-next/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

PostRouter.post(
  "/",
  upload.single("image"),
  expressAsyncHandler(async (req, res) => {
    const Posts = new Post({
      user: req.body._id,
      user_username: req.body.username,
      image: req.file.originalname,
      caption: req.body.caption,
    });
    const newPost = await Posts.save();
    res.status(201).send("Post Added!");
  })
);
PostRouter.get(
  "/get/posts",
  expressAsyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.status(201).send(posts);
  })
);

PostRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const posts = await Post.findOne({ _id: req.params.id });
    if (posts) {
      res.send(posts);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  })
);

PostRouter.get(
  "/user/:id",
  expressAsyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.params.id });
    if (posts) {
      res.send(posts);
    } else {
      res.status(404).send({ message: "An error occured" });
    }
  })
);

PostRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    res.send("Post Deleted!");
  })
);

PostRouter.put(
  "/:id",
  upload.single("image"),
  expressAsyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id);
    if (post) {
      post.user = post.user;
      post.user_username = post.user_username;
      post.image = req.file.originalname;
      post.caption = req.body.caption;

      const updatedPost = post.save();
      res.send("Post Updated!");
    }
  })
);

export default PostRouter;

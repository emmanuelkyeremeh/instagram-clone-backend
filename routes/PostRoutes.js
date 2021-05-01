import express from "express";
import expressAsyncHandler from "express-async-handler";
import Post from "../models/PostModel.js";

const PostRouter = express.Router();

PostRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const Posts = new Post({
      user: req.body._id,
      user_username: req.body.username,
      imageName: req.body.imageName,
      actualImage: req.body.actualImage,
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
  expressAsyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id);
    if (post) {
      post.user = post.user;
      post.user_username = post.user_username;
      post.imageName = req.body.imageName || post.imageName;
      post.actualImage = req.body.actualImage || post.actualImage;
      post.caption = req.body.caption || post.caption;

      const updatedPost = post.save();
      res.send("Post Updated!");
    } else {
      res.send("Cannot find post!");
    }
  })
);

export default PostRouter;

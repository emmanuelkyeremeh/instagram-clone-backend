import express from "express";
import expressAsyncHandler from "express-async-handler";
import Comment from "../models/CommentModel.js";

const CommentRouter = express.Router();

CommentRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const comment = new Comment({
      postid: req.body.postid,
      username: req.body.username,
      comment: req.body.comment,
      date: req.body.date,
    });
    const newComment = await comment.save();
    res.status(201).send("Comment Added!");
  })
);

CommentRouter.get(
  "/get/comment/:id",
  expressAsyncHandler(async (req, res) => {
    const PostComments = await Comment.find({ postid: req.params.id });
    if (PostComments) {
      res.status(201).send(PostComments);
    }
  })
);

CommentRouter.get(
  "/get/comments",
  expressAsyncHandler(async (req, res) => {
    const AllpostComments = await Comment.find();
    if (AllpostComments) {
      res.status(201).send(AllpostComments);
    } else {
      res.status(404).send("An Error occurred");
    }
  })
);

export default CommentRouter;

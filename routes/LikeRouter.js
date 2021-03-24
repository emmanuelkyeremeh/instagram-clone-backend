import express from "express";
import expressAsyncHandler from "express-async-handler";
import Like from "../models/LikeModel.js";

const LikeRouter = express.Router();

LikeRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const newLike = new Like({
      userid: req.body.id,
      postid: req.body.postid,
    });
    const saveLike = await newLike.save();
    res.status(201).send("Post Liked successfully!");
  })
);

LikeRouter.get(
  "/get/likes",
  expressAsyncHandler(async (req, res) => {
    const like = await Like.find();
    if (like) {
      res.status(201).send(like);
    } else {
      res.status(404).send("Data not found!");
    }
  })
);

LikeRouter.get(
  "/:userid/:postid",
  expressAsyncHandler(async (req, res) => {
    const singlelike = Like.find({
      userid: req.params.userid,
      postid: req.params.postid,
    });
    if (singlelike) {
      res.status(201).send(singlelike);
    } else {
      res.status(404).send("Data not found!");
    }
  })
);

export default LikeRouter;

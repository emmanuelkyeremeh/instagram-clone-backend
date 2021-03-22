import express from "express";
import expressAsyncHandler from "express-async-handler";
import Follow from "../models/FollowModel.js";

const FollowRouter = express.Router();

FollowRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const follow = new Follow({
      user_follower: req.body.follower,
      user_followed: req.body.followed,
    });
    const newFollow = await follow.save();
    res.status(201).send("Follow saved!");
  })
);
FollowRouter.get(
  "/info/:follower/:followed",
  expressAsyncHandler(async (req, res) => {
    const followInfo = await Follow.find({
      user_follower: req.params.follower,
      user_followed: req.params.followed,
    });
    if (followInfo) {
      res.status(201).send(followInfo);
    } else {
      res.status(404).send("Data not Found!");
    }
  })
);

export default FollowRouter;

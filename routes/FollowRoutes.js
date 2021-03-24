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
  "/info/",
  expressAsyncHandler(async (req, res) => {
    const followInfo = await Follow.find();
    if (followInfo) {
      res.status(201).send(followInfo);
    } else {
      res.status(404).send("Data not Found!");
    }
  })
);
FollowRouter.get(
  "/followers/:id",
  expressAsyncHandler(async (req, res) => {
    const followers = await Follow.find({ user_followed: req.params.id });
    if (followers) {
      res.status(201).send(followers);
    } else {
      res.status(404).send("An Error occured.");
    }
  })
);

FollowRouter.get(
  "/following/:id",
  expressAsyncHandler(async (req, res) => {
    const following = await Follow.find({ user_follower: req.params.id });
    if (following) {
      res.status(201).send(followers);
    } else {
      res.status(404).send("An Error occured.");
    }
  })
);

export default FollowRouter;

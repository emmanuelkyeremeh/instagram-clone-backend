import express from "express";
import expressAsyncHander from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Auth.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  expressAsyncHander(async (req, res) => {
    const users = await User.find();
    if (users) {
      res.status(201).send(users);
    } else {
      res.status(404).send("An Error Occurred");
    }
  })
);
userRouter.get(
  "/:id",
  expressAsyncHander(async (req, res) => {
    const singleUser = await User.findById(req.params.id);
    if (singleUser) {
      res.status(201).send(singleUser);
    } else {
      res.status(404).send("Could not find user");
    }
  })
);

userRouter.post(
  "/signup",
  expressAsyncHander(async (req, res) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      avatarName: req.body.avatarName,
      actualAvatar: req.body.actualAvatar,
      bio: req.body.bio,
    });
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      avatarName: newUser.avatarName,
      actualAvatar: newUser.actualAvatar,
      bio: newUser.bio,
      token: generateToken(newUser),
    });
  })
);

userRouter.post(
  "/login",
  expressAsyncHander(async (req, res) => {
    const user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password))
        res.send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          avatarName: user.avatarName,
          actualAvatar: user.actualAvatar,
          bio: user.bio,
          token: generateToken(user),
        });
      return;
    } else {
      res.status(401).send({
        message: "Email or password is incorrect!",
      });
    }
  })
);

userRouter.put(
  "/update/user/:id",
  expressAsyncHander(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.avatarName = req.body.avatarName || user.avatarName;
      user.actualAvatar = req.body.actualAvatar || user.actualAvatar;
      user.bio = req.body.bio || user.bio;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = user.save();
      res.send({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarName: updatedUser.avatarName,
        actualAvatar: updatedUser.actualAvatar,
        bio: updatedUser.bio,
        token: generateToken(updatedUser),
      });
    }
  })
);

export default userRouter;

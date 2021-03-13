import express from "express";
import expressAsyncHander from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Auth.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  expressAsyncHander(async (req, res) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
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

export default userRouter;

import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postid: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", LikeSchema);
export default Like;

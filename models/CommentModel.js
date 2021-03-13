import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;

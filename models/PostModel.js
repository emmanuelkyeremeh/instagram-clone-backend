import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_username: { type: String, required: true },
    caption: { type: String, required: false },
    imageName: { type: String, required: true },
    actualImage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;

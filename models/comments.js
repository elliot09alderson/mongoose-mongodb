import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  content: String,
  author: String,
  metadata: { views: Number, likes: Number },
  comments: [{ user: String, text: String }],

  CreatedAt: { type: Date, default: Date.now() },
});
export const comments = mongoose.model("comments", commentSchema);

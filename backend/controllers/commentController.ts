import { Request, Response } from "express";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

const post_comment = async (req: Request, res: Response) => {
  const { comment, userID } = req.body;
  const { postID } = req.params;
  try {
    const post = await Post.findById(postID);
    if (post) {
      const newComment = new Comment({
        user: userID,
        comment,
        likes: [],
      });
      Promise.all([
        newComment.save(),
        post.updateOne({ $push: { comments: newComment } }),
      ])
        .then(() => {
          return res.status(200).json({
            message: "Comment was successfully sent.",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: err.message,
          });
        });
    } else {
      return res.status(404).json({ message: "The user could not be found." });
    }
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const comment_like = async (req: Request, res: Response) => {
  const { postID, commentID }: any = req.params;
  const { userID } = req.body;
  try {
    const post = await Post.findById(postID);
    const comment = await Comment.findById(commentID);
    const user = await User.findById(userID);
    if (post && comment && user) {
      if (comment.likes.includes(userID)) {
        await comment.updateOne({ $pull: { likes: userID } });
        const updatedLikes = await Comment.findById(commentID)
          .select("likes")
          .lean();
        res.status(200).json({ likes: updatedLikes?.likes });
      } else {
        await comment.updateOne({ $push: { likes: userID } });
        const updatedLikes = await Comment.findById(commentID)
          .select("likes")
          .lean();
        res.status(200).json({ likes: updatedLikes?.likes });
      }
    } else {
      res.status(404).json({ message: "The comment was not found!" });
    }
  } catch {
    res.status(404).json({ message: "The comment was not found!" });
  }
};

const comment_delete = async (req: Request, res: Response) => {
  const { postID, commentID }: any = req.params;
  try {
    const comment = await Comment.findById(commentID);
    const post = await Post.findById(postID);
    if (comment && post) {
      Promise.all([
        comment.deleteOne(),
        post.updateOne({ $pull: { comments: commentID } }),
      ])
        .then(() => {
          res.status(200).json({
            message: "Comment was successfully deleted",
          });
        })
        .catch((err: any) => {
          res.status(400).json({ message: err.message });
        });
    } else {
      res.json({ message: "You cannot delete this comment." });
    }
  } catch {
    res.status(404).json({ message: "The comment was not found!" });
  }
};

export default {
  post_comment,
  comment_like,
  comment_delete,
};

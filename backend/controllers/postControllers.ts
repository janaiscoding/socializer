import Post from "../models/post";
import Comment from "../models/comment";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import validator from "validator";
import User from "../models/user";

const posts_get = asyncHandler(async (req, res, next) => {
  const postsData = await Post.find({})
    .select("text comments likes createdAt")
    .populate({
      path: "comments",
      select: "text likes createdAt",
      populate: { path: "user", select: "first_name last_name" }, // + profile pic
    })
    .populate({ path: "user", select: "first_name last_name" }) // + profile pic
    .sort({ createdAt: "desc" })
    .exec();
  if (postsData) {
    res.json({
      message: "HOMEPAGE POSTS | PROTECTED.",
      posts: postsData.map((post) => {
        post.text = validator.unescape(post.text);
        return post;
      }),
    });
  } else {
    res.status(404).json({ info: "No posts yet." });
  }
});

const post_create = [
  body("text")
    .trim()
    .exists()
    .withMessage("Post must be present")
    .isLength({ min: 5 })
    .withMessage("Post must be at least 5 characters long.")
    .isLength({ max: 300 })
    .withMessage("Post must be maximum 300 characters long.")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { userID } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        text: validator.unescape(text),
      });
    } else {
      //no validation errors on post
      const user = await User.findById(userID).exec();
      if (user) {
        const newPost = new Post({
          user: userID,
          text,
          comments: [],
          likes: [],
        });
        await newPost.save();
        const initialPosts = user.posts;
        // @ts-ignore
        initialPosts.push(newPost);
        await User.findByIdAndUpdate(userID, {
          posts: initialPosts,
        });
        res.json({ info: "New post created, profile updated", newPost });
      } else {
        res.json({ info: "No user was not found to make this post." });
      }
    }
  }),
];

const post_comment = [
  body("text")
    .trim()
    .exists()
    .withMessage("Comment is required.")
    .isLength({ min: 5 })
    .withMessage("Comment must be at least 5 characters long.")
    .isLength({ max: 300 })
    .withMessage("Comment must be maximum 300 characters long")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { postID, userID } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        text: validator.unescape(text),
      });
    } else {
      const user = await User.findById(userID).exec();
      const post = await Post.findById(postID).exec();
      if (user && post) {
        const comment = new Comment({
          user: userID,
          text,
          likes: [],
        });
        await comment.save();
        //@ts-ignore
        post.comments.push(comment);
        await post.save();
        res.json({
          comment,
          info: "Comment was posted successfully",
        });
      } else {
        res.json({ info: "No user was not found to make this post." });
      }
    }
  }),
];

const post_update = [
  body("updatedText")
    .trim()
    .exists()
    .withMessage("Post must be present")
    .isLength({ min: 5 })
    .withMessage("Post must be at least 5 characters long.")
    .isLength({ max: 300 })
    .withMessage("Post must be maximum 300 characters long.")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { postID, userID } = req.params;
    const { updatedText } = req.body;
    const errors = validationResult(req);
    const post = await Post.findById(postID);
    const user = await User.findById(userID);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        text: validator.unescape(updatedText),
      });
    } else {
      // console.log(post.user === user._id)
      if (post && user) {
        await Post.findByIdAndUpdate(postID, {
          text: updatedText,
        });
        res.json({ info: "Post was successfully updated!" });
      } else {
        res.status(403).json({ info: "You cannot edit this post." });
      }
    }
  }),
];

const post_delete = asyncHandler(async (req, res, next) => {
  const { postID, userID } = req.params;
  const post = await Post.findById(postID);
  const user = await User.findById(userID);
  if (post && user) {
    // Clean-up sequence
    const comments = post.comments;
    for (const comment of comments) {
      await Comment.findByIdAndDelete(comment);
    }
    await post.deleteOne();
    await User.findByIdAndUpdate(userID, { $pull: { posts: postID } });
    res.json({ info: "Post was deleted successfully!" });
  } else {
    res.status(404).json({ info: "You cannot delete this post." });
  }
});
const post_like = asyncHandler(async (req, res, next) => {
  const { postID, userID }: any = req.params;
  const post = await Post.findById(postID);
  if (post) {
    if (post.likes.includes(userID)) {
      //@ts-ignore
      post.likes.pull(userID);
      await post.save();
      res.json({ info: `${userID} has disliked post ${postID}` });
    } else {
      post.likes.push(userID);
      await post.save();
      res.json({ info: `${userID} has liked post ${postID}` });
    }
  } else {
    res.status(404).json({ info: "Post was not found!" });
  }
});
export default {
  posts_get,
  post_create,
  post_comment,
  post_update,
  post_delete,
  post_like,
};

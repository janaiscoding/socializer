import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import postControllers from "../controllers/postControllers";
import authControllers from "../controllers/authControllers";
import passport from "passport";

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  postControllers.posts_get
);

router.post("/signup", authControllers.signup_post);
router.post("/login", authControllers.login_post);
router.post('/logout', authControllers.logout)
export default router;

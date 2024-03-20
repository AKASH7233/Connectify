import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.js"
import { Followers, following, toggleFollow } from "../controllers/follow.controller.js";

const router = Router();
router.use(verifyJWT)

router.route("/togglefollow/:userTofollow").post(toggleFollow)
router.route("/followers/:followedTo").post(Followers)
router.route("/following/:followingBy").post(following)

export default router
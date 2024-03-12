import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.js"
import { Followers, following, toggleFollow } from "../controllers/follow.controller.js";

const router = Router();
router.use(verifyJWT)

router.route("/togglefollow/:userTofollow").post(toggleFollow)
router.route("/followers/:followedBy").post(Followers)
router.route("/following/:followingTo").post(following)

export default router
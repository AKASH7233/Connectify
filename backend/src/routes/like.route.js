import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.js"
import { likedPosts, toggleLike, userLiked} from "../controllers/like.controller.js"

const router = Router()
router.use(verifyJWT)

router.route('/togglelike/:postId').post(toggleLike)
router.route('/postlikes/:postId').post(userLiked)
router.route('/postliked').post(likedPosts)

export default router;


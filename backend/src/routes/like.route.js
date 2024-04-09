import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.js"
import { commentLiked, likedPosts, toggleCommentsLike, toggleLike, userLiked} from "../controllers/like.controller.js"

const router = Router()
router.use(verifyJWT)

router.route('/togglelike/:postId').post(toggleLike)
router.route('/postlikes/:postId').post(userLiked)
router.route('/postliked').post(likedPosts)

router.route('/toggleComment/:CommentId').post(toggleCommentsLike)
router.route('/Commentlikes/:CommentId').post(commentLiked)


export default router;


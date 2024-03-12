import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteComment, editComment, postComment } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/addcomment/:postId').post(postComment)
router.route('/editcomment/:commentId').post(editComment)
router.route('/deletecomment/:commentId').post(deleteComment)


export default router
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteComment, editComment, postComment, showComments } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/showcomments/:postId').get(showComments)
router.route('/addcomment/:postId').post(postComment)
router.route('/editcomment/:commentId').post(editComment)
router.route('/deletecomment/:commentId').post(deleteComment)


export default router
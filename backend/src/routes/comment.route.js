import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteComment, editComment, postComment, replyToComment, showComments, showReplyComments } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/showcomments/:postId').get(showComments)
router.route('/addcomment/:postId').post(postComment)
router.route('/editcomment/:commentId').post(editComment)
router.route('/deletecomment/:commentId').post(deleteComment)
router.route('/replycomment/:commentId').post(replyToComment)
router.route('/showreplycomment/:commentId').get(showReplyComments)

export default router
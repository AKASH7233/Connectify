import { Router } from "express";
import { 
    deletePost, 
    updatePostTitle, 
    uploadPost, 
    showPosts, 
    hidePost, 
    showPostLikes,
    postComments
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.js";
import { postComment } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT)

router.route('/post').post(
    showPosts
)

router.route('/uploadpost').post(
    upload.fields([
        {
            name: "postFile",
            maxCount: 10
        }
    ]),
    uploadPost
)

router.route('/updatepost/:postId').post(
    updatePostTitle
)

router.route('/deletepost/:postId').post(
    deletePost
)

router.route('/hidepost/:postId').post(
    hidePost
)
router.route('/showlikes/:postId').post(
    showPostLikes
)

router.route('/showcomments/:postId').post(
    postComments
)

export default router
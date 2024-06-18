import { Router } from "express";
import { 
    deletePost, 
    updatePostTitle, 
    uploadPost, 
    showPosts,  
    showPostLikes,
    postComments,
    visitedPost,
    togglehidePost,
    myPosts,
    hiddenPost,
    getTaggedUsers,
    getTaggedPost
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.js";

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

router.route('/gettaggedpost/:userId').post(
    getTaggedPost
)

router.route('/gettaggeduser/:postId').post(
    getTaggedUsers
)

router.route('/myposts/:userId').post(
    myPosts
)

router.route('/hiddenpost').post(
    hiddenPost
)
router.route('/deletepost/:postId').post(
    deletePost
)

router.route('/togglehidepost/:postId').post(
    togglehidePost
)

router.route('/showlikes/:postId').post(
    showPostLikes
)

router.route('/showcomments/:postId').post(
    postComments
)
router.route('/visitedpost/:postId').post(
    visitedPost
)

export default router
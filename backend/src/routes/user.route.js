import { Router } from "express";
import {upload} from  '../middlewares/multer.middlewares.js'
import { 
    UserRegister, 
    userLogout, 
    userLogin,
    updateAccountDetails,
    refreshAccessToken,
    updateCoverImage,
    updateProfileImage,
    updatePassword,
    deleteProfileImage,
    deletecoverImage,
    deleteUser, 
    currentUser,
    getUserProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "coverImage" ,
            maxCount: 1
        },
        {
            name: "ProfileImage",
            maxCount: 1 
        }
    ]),
    UserRegister
)

router.route('/login').post(userLogin)
router.route('/logout').post(
    verifyJWT,
    userLogout
)
router.route('/logout').post(
    verifyJWT,
    userLogout
)
router.route('/profile').post(
    verifyJWT,
    currentUser
)
router.route('/updateaccount').post(
    verifyJWT,
    updateAccountDetails
)
router.route('/refreshToken').post(
    verifyJWT,
    refreshAccessToken
)
router.route('/updateCoverImage').post(
    upload.fields(
        [
            {
               name : "coverImage", 
               maxCount: 1
            }
        ]
    ),
    verifyJWT,
    updateCoverImage
)
router.route('/updateProfileImage').post(
    upload.fields([
        {
            name: "ProfileImage",
            maxCount:1
        }
    ]),
    verifyJWT,
    updateProfileImage
)

router.route('/updatePassword').post(
    verifyJWT,
    updatePassword
)

router.route('/deleteProfileImage').post(
    verifyJWT,
    deleteProfileImage
)
router.route('/deletecoverImage').post(
    verifyJWT,
    deletecoverImage
)
router.route('/deleteUser').post(
    verifyJWT,
    deleteUser
)
router.route('/profile/:username').post(
    verifyJWT,
    getUserProfile
)

export default router
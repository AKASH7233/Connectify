import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { AllBookedPost, bookMarkedPost, toggleBookmark, } from "../controllers/bookmark.controller.js";

const router = Router()
router.use(verifyJWT);

router.route('/toggleBook/:postId').post(toggleBookmark)
router.route('/isBooked/:postId').post(bookMarkedPost)
router.route('/bookedPosts').post(AllBookedPost)

export default router 

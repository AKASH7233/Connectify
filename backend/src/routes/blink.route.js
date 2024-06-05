import express from 'express'
import { verifyJWT } from '../middlewares/auth.js'
import { BlinkViewed, createBlink, currentBlinks, deleteAllBlink, deleteBlink, getBlink, myBlink, viewersOfBlink } from '../controllers/blink.controller.js'
import { upload } from '../middlewares/multer.middlewares.js'

const router = express.Router()
router.use(verifyJWT)

router.route('/createBlink').post(
    upload.single('BlinkFile'),
    createBlink
)

router.route('/deleteBlink/:blinkId').post(
    deleteBlink
)

router.route('/deleteAllBlink').post(
    deleteAllBlink
)

router.route('/myBlinks').get(
    myBlink
)

router.route('/getBlinks').get(
    getBlink
)

router.route('/blinkviewed/:blinkId').post(
    BlinkViewed
)

router.route('/viewblinks/:blinkId').post(
    viewersOfBlink
)

router.route('/currentBlinks').get(
    currentBlinks
)

export default router
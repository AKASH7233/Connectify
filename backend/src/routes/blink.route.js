import express from 'express'
import { verifyJWT } from '../middlewares/auth.js'
import { createBlink, currentBlinks, deleteAllBlink, deleteBlink, getBlink, myBlink, viewBlink } from '../controllers/blink.controller.js'
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
router.route('/viewBlinks').get(
    viewBlink
)

router.route('/currentBlinks').get(
    currentBlinks
)

export default router
import express from 'express'
import { verifyJWT } from '../middlewares/auth.js'
import { createBlink, deleteAllBlink, deleteBlink, getBlink, myBlink } from '../controllers/blink.controller.js'
import { upload } from '../middlewares/multer.middlewares.js'

const router = express.Router()
router.use(verifyJWT)

router.route('/createBlink').post(
    upload.single('postFile'),
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

export default router
import express from 'express'
import { verifyJWT } from '../middlewares/auth.js'
import { createBlink } from '../controllers/blink.controller.js'
import { upload } from '../middlewares/multer.middlewares.js'

const router = express.Router()
router.use(verifyJWT)

router.route('/createBlink').post(
    upload.single('postFile'),
    createBlink
)

export default router
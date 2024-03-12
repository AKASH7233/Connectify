import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { search } from "../controllers/search.controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/search/:search').post(search)

export default router
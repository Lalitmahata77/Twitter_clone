import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { followUnfollowUser, getUserProfile } from "../controller/user.controller.js"

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.post("/follow/:id", protectRoute,followUnfollowUser)



export default router
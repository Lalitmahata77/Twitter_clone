import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUser } from "../controller/user.controller.js"

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.post("/follow/:id", protectRoute,followUnfollowUser)
router.get("/suggested", protectRoute, getSuggestedUser)
router.post("/update", protectRoute, updateUser)



export default router
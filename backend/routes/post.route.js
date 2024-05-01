import express from "express"
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPost, getUserPost, likeUnLike, userLikedPost } from "../controller/post.controller.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/create",protectRoute,createPost)
router.delete("/:id",protectRoute, deletePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.post("/likes/:id", protectRoute, likeUnLike)
router.get("/getAll", protectRoute, getAllPost)
router.get("/liked/:id",protectRoute, userLikedPost)
router.get("/following", protectRoute,getFollowingPost)
router.get("/:username", protectRoute,getUserPost)
export default router
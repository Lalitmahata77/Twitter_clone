import express from "express"
import { commentOnPost, createPost, deletePost, likeUnLike } from "../controller/post.controller.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/create",protectRoute,createPost)
router.delete("/:id",protectRoute, deletePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.post("/likes/:id", protectRoute, likeUnLike)
export default router
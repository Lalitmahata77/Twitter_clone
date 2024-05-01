import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { deleteNotification, getAllNotification } from "../controller/notification.controller.js"

const router = express.Router()

router.get("/", protectRoute,  getAllNotification)
router.delete("/delete",protectRoute, deleteNotification)

export default router
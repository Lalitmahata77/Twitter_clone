import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import connectMongoDb from "./db/connectToDb.js"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary"
const app = express()

dotenv.config()
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser())
const PORT = process.env.PORT || 5000
app.use("/api/auth/", authRoute)
app.use("/api/user/", userRoute)
app.use("/api/posts", postRoute)
app.listen(PORT, ()=>{
    connectMongoDb()
    console.log(`server is listening on ${PORT}`);
})

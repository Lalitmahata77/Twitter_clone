import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import connectMongoDb from "./db/connectToDb.js"
import cookieParser from "cookie-parser"
const app = express()

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser())
const PORT = process.env.PORT || 5000
app.use("/api/auth/", authRoute)
app.listen(PORT, ()=>{
    connectMongoDb()
    console.log(`server is listening on ${PORT}`);
})

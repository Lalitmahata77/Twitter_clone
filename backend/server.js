import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import connectMongoDb from "./db/connectToDb.js"
const app = express()

dotenv.config()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use("/api/auth/", authRoute)
app.listen(PORT, ()=>{
    connectMongoDb()
    console.log(`server is listening on ${PORT}`);
})

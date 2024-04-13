import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({limit:"20kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1",userRouter)


//http://localhost:8000/api/v1 and so on

export default app
import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connect-DB.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoute from "./routes/authRoutes.js"
import blogRoute from "./routes/blogRoutes.js"

const app= express()
dotenv.config()
connectDb()
app.use(cors({
  origin:['http://localhost:5173','https://full-stack-blog-app-evn4.vercel.app'],
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req,res)=>{
 res.send("helooo")
})

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/blog",blogRoute )

const PORT = process.env.PORT
console.log("PORT---------->",PORT)

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`
  );
  })

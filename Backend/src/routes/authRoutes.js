import express from "express"
import {SignUp,Login,Logout,AllUsers,GetUser,updateUser,deleteUser} from "../controllers/authController.js"
import authantication from "../middleware/authMiddleware.js"
import  { userMiddlware, adminMiddlware } from "../middleware/Adminmiddle.js"
const AuthRoute = express.Router()

AuthRoute.post('/signup',SignUp)
console.log("yaan aya");

AuthRoute.post('/login',Login)
AuthRoute.get("/logout",Logout)
AuthRoute.get("/users",authantication,adminMiddlware, AllUsers)
AuthRoute.get("/user/:id",authantication,GetUser)
AuthRoute.put("/user/:id",authantication,updateUser)
AuthRoute.delete("/user/:id",authantication,deleteUser)

export default AuthRoute
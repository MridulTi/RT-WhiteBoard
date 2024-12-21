import { Router } from "express";
import { verifyJWT } from "../middlewares/middlewares";
import googleAuth from "../controllers/auth.controllers";


const authRouter=Router()
const sessionRouter=Router()

// AUTH ROUTER
authRouter.route("/auth/google").get(verifyJWT,googleAuth)


export {
    authRouter,
    sessionRouter
}
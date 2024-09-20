import { Router } from "express";
import { getSession, getWhiteBoard } from "./controllers/white.controller";

const router=Router();

// user Router
router.get("/",getWhiteBoard)
router.get("/session/:id",getSession)

export default router
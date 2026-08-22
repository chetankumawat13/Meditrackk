import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { verifyToken, verifyPatient } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/me', verifyToken, verifyPatient, getUserProfile);

export default userRouter;

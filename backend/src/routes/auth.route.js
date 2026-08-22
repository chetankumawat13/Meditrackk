import { Router } from "express";
import { registerPatient, registerStore, patientLogin, storeLogin, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register/patient', registerPatient);
authRouter.post('/register/store', registerStore);
authRouter.post('/login/patient', patientLogin);
authRouter.post('/login/store', storeLogin);
authRouter.post('/logout', verifyToken, logout);

export default authRouter;
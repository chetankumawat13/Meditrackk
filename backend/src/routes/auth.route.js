import { Router } from "express";
import { registerPatientController, registerStoreController, patientLoginController, storeLoginController } from "../controllers/auth.controller.js";

const authRouter = Router();


authRouter.post('/register/patient',registerPatientController)

authRouter.post('/register/store',registerStoreController)


authRouter.post('/login/patient',patientLoginController)

authRouter.post('/login/store',storeLoginController)

export default authRouter
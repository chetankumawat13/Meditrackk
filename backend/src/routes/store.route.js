import { Router } from "express";
import { getStoreProfile, updateStoreProfile, getStoreDashboard, getStorePatients, getPatientProfile, getAllStores } from "../controllers/store.controller.js";
import { verifyToken, verifyStore, verifyPatient } from "../middleware/auth.middleware.js";

const storeRouter = Router();

storeRouter.get('/all', getAllStores);
storeRouter.get('/profile', verifyToken, verifyStore, getStoreProfile);
storeRouter.put('/profile', verifyToken, verifyStore, updateStoreProfile);
storeRouter.get('/dashboard/stats', verifyToken, verifyStore, getStoreDashboard);
storeRouter.get('/patients/list', verifyToken, verifyStore, getStorePatients);
storeRouter.get('/patients/:patientId', verifyToken, verifyStore, getPatientProfile);

export default storeRouter;

import { Router } from 'express';
import { verifyToken, verifyStore } from '../middleware/auth.middleware.js';
import { readPrescription } from '../controllers/prescription.controller.js';

const prescriptionRouter = Router();

prescriptionRouter.post('/read', verifyToken, verifyStore, readPrescription);

export default prescriptionRouter;
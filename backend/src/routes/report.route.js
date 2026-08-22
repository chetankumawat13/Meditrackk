import { Router } from "express";
import { createReport, getPatientReports, getStoreReports, getReportById, updateReportStatus, getReportStats } from "../controllers/report.controller.js";
import { verifyToken, verifyPatient, verifyStore } from "../middleware/auth.middleware.js";

const reportRouter = Router();

reportRouter.post('/create', verifyToken, verifyPatient, createReport);
reportRouter.get('/patient/list', verifyToken, verifyPatient, getPatientReports);
reportRouter.get('/store/list', verifyToken, verifyStore, getStoreReports);
reportRouter.get('/store/stats', verifyToken, verifyStore, getReportStats);
reportRouter.get('/:id', verifyToken, getReportById);
reportRouter.put('/:id/status', verifyToken, verifyStore, updateReportStatus);

export default reportRouter;

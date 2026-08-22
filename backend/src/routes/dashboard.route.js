import { Router } from "express";
import { getStoreDashboard, getPatientDashboard, getDetailedAnalytics } from "../controllers/dashboard.controller.js";
import { verifyToken, verifyStore, verifyPatient } from "../middleware/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get('/store', verifyToken, verifyStore, getStoreDashboard);
dashboardRouter.get('/patient', verifyToken, verifyPatient, getPatientDashboard);
dashboardRouter.get('/analytics', verifyToken, verifyStore, getDetailedAnalytics);

export default dashboardRouter;

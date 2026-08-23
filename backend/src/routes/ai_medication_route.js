import { Router } from "express";
import {
    getPatientMedicationStats,
    triggerAICheckNow,
    getAIMedicationAlerts,
    getAIAlertDetail,
    markAlertAsConsulted,
    runFullMedicationCheck,
    getMedicineAIInsights
} from "../controllers/ai_medication_controller.js";
import { verifyToken, verifyPatient } from "../middleware/auth.middleware.js";

const aiMedicationRouter = Router();

// ============================================================
// Patient endpoints - Requires authentication + patient role
// ============================================================

// Get patient's medication usage statistics
aiMedicationRouter.get('/stats', verifyToken, verifyPatient, getPatientMedicationStats);

// Manually trigger AI check for a specific medicine
aiMedicationRouter.post('/check-now', verifyToken, verifyPatient, triggerAICheckNow);

// Get all AI-generated alerts for this patient
aiMedicationRouter.get('/alerts', verifyToken, verifyPatient, getAIMedicationAlerts);

// Get detailed analysis for a specific alert
aiMedicationRouter.get('/alerts/:alertId', verifyToken, verifyPatient, getAIAlertDetail);

// Mark that patient consulted doctor about alert
aiMedicationRouter.put('/alerts/:alertId/consulted', verifyToken, verifyPatient, markAlertAsConsulted);

// ============================================================
// Public/Insights endpoints
// ============================================================

// Get AI insights about a specific medicine (common issues across patients)
aiMedicationRouter.get('/medicine-insights/:medicineId', getMedicineAIInsights);

// ============================================================
// Admin endpoints - Add admin role check if available
// ============================================================

// Manually run full medication check job for all patients
// TODO: Add admin role verification middleware
aiMedicationRouter.post('/admin/run-check', verifyToken, runFullMedicationCheck);

export default aiMedicationRouter;

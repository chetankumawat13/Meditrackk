import { checkMedicineUsagePattern, getPatientMedicationStats as getMedicationStats } from "../services/medication_monitoring_service.js";
import { runImmediateMedicationCheck } from "../services/medication_scheduler.js";
import alertModel from "../models/alert.model.js";

/**
 * GET /api/ai-medication/stats
 * Get patient's medication statistics and continuous usage patterns
 * Patient-only endpoint
 */
export const getPatientMedicationStats = async (req, res) => {
    try {
        const stats = await getMedicationStats(req.user.id);

        res.status(200).json({
            success: true,
            count: stats.length,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/ai-medication/check-now
 * Manually trigger AI check for a specific medicine
 * Useful for testing or when patient wants immediate analysis
 */
export const triggerAICheckNow = async (req, res) => {
    try {
        const { medicineId } = req.body;

        if (!medicineId) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID is required"
            });
        }

        const result = await checkMedicineUsagePattern(req.user.id, medicineId);

        res.status(200).json({
            success: true,
            result,
            message: result.triggered 
                ? "AI analysis completed and alert created" 
                : `Check not triggered: ${result.reason || result.error}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/ai-medication/alerts
 * Get all AI-generated medication alerts for patient
 * Filtered to show only AI alerts
 */
export const getAIMedicationAlerts = async (req, res) => {
    try {
        const aiAlerts = await alertModel.find({
            patientId: req.user.id,
            alertType: {
                $in: ["ai_medication_warning", "medication_side_effect_warning"]
            }
        })
        .populate('medicineId', 'name genericName category')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: aiAlerts.length,
            alerts: aiAlerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/ai-medication/alerts/:alertId
 * Get detailed AI analysis for a specific alert
 */
export const getAIAlertDetail = async (req, res) => {
    try {
        const { alertId } = req.params;

        const alert = await alertModel.findById(alertId)
            .populate('patientId', 'fullname email contact')
            .populate('medicineId', 'name genericName category composition');

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        // Verify ownership
        if (alert.patientId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            alert,
            aiAnalysis: alert.aiAnalysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/ai-medication/alerts/:alertId/mark-consulted
 * Patient marks that they've consulted with doctor about this alert
 */
export const markAlertAsConsulted = async (req, res) => {
    try {
        const { alertId } = req.params;
        const { status, doctorNotes } = req.body;

        const validStatuses = ["pending", "scheduled", "completed", "not_needed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid consultation status"
            });
        }

        const alert = await alertModel.findById(alertId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        if (alert.patientId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        alert.doctorConsultationStatus = status;
        if (doctorNotes) alert.doctorNotes = doctorNotes;
        await alert.save();

        res.status(200).json({
            success: true,
            message: "Consultation status updated",
            alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/admin/ai-medication/run-check
 * Admin endpoint: Manually trigger full medication check job
 * Checks all patients
 */
export const runFullMedicationCheck = async (req, res) => {
    try {
        // Verify admin role if needed (add admin role check based on your auth)
        const result = await runImmediateMedicationCheck();

        res.status(200).json({
            success: true,
            message: "Medication check job completed",
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/ai-medication/medication-recommendations/:medicineId
 * Get detailed info about a medicine from AI perspective
 * Including side effects, interactions, common reactions
 */
export const getMedicineAIInsights = async (req, res) => {
    try {
        const { medicineId } = req.params;

        // Get all alerts related to this medicine
        const alerts = await alertModel.find({
            medicineId,
            alertType: {
                $in: ["ai_medication_warning", "medication_side_effect_warning"]
            }
        }).sort({ createdAt: -1 });

        // Summary statistics
        const insights = {
            totalAlertsGenerated: alerts.length,
            severityBreakdown: {
                high: alerts.filter(a => a.severity === "high").length,
                medium: alerts.filter(a => a.severity === "medium").length,
                low: alerts.filter(a => a.severity === "low").length
            },
            commonIssues: extractCommonIssues(alerts),
            recentAlerts: alerts.slice(0, 5)
        };

        res.status(200).json({
            success: true,
            insights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Extract common issues from alerts
 */
function extractCommonIssues(alerts) {
    const issues = {};

    alerts.forEach(alert => {
        if (alert.aiAnalysis?.potentialSideEffects) {
            const key = alert.aiAnalysis.potentialSideEffects;
            issues[key] = (issues[key] || 0) + 1;
        }
    });

    return Object.entries(issues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([issue, count]) => ({ issue, frequency: count }));
}

export default {
    getPatientMedicationStats,
    triggerAICheckNow,
    getAIMedicationAlerts,
    getAIAlertDetail,
    markAlertAsConsulted,
    runFullMedicationCheck,
    getMedicineAIInsights
};

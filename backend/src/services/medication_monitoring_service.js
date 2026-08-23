import purchaseModel from "../models/purchase.model.js";
import userModel from "../models/user.model.js";
import medicineModel from "../models/medicine.model.js";
import alertModel from "../models/alert.model.js";
import { analyzeMedicationPattern, getExpectedReactionTime } from "./mistral_ai_service.js";

/**
 * Check if a patient is continuously taking the same medicine
 * and trigger AI analysis if threshold is met
 */
export const checkMedicineUsagePattern = async (patientId, medicineId) => {
    try {
        const patient = await userModel.findById(patientId);
        if (!patient) throw new Error("Patient not found");

        const medicine = await medicineModel.findById(medicineId);
        if (!medicine) throw new Error("Medicine not found");

        // Get all purchases of this medicine by this patient
        const purchases = await purchaseModel.find({
            patientId,
            "medicines.medicineId": medicineId
        }).sort({ createdAt: -1 });

        if (purchases.length < 2) {
            return { triggered: false, reason: "Less than 2 purchases" };
        }

        // Analyze purchase pattern
        const pattern = analyzePurchasePattern(purchases, medicineId);

        if (!pattern.isContinuous) {
            return { triggered: false, reason: "Not continuous usage" };
        }

        // Check if enough time has passed for effects to show
        const expectedReactionDays = getExpectedReactionTime(medicine.name, medicine.category);
        
        if (pattern.continuousDays < expectedReactionDays) {
            return {
                triggered: false,
                reason: `Effects expected in ${expectedReactionDays - pattern.continuousDays} more days`
            };
        }

        // Get patient's complete medication history
        const allPurchases = await purchaseModel.find({ patientId })
            .sort({ createdAt: -1 })
            .limit(20);

        // Prepare data for AI analysis
        const aiInput = {
            age: calculateAge(patient.dateOfBirth),
            gender: patient.gender,
            allergies: [], // You may want to add allergy field to user model
            purchaseHistory: allPurchases,
            currentMedicine: {
                name: medicine.name,
                genericName: medicine.genericName,
                category: medicine.category,
                composition: medicine.composition
            },
            continuousUseDays: pattern.continuousDays,
            purchaseCount: purchases.length,
            expectedReactionTime: expectedReactionDays,
            dosageFrequency: `Every ${pattern.avgDaysBetweenPurchases} days`,
            reportedEffects: "None reported" // Can be extended to include user feedback
        };

        // Call Mistral AI for analysis
        const aiAnalysis = await analyzeMedicationPattern(aiInput);

        // Create alert based on AI analysis
        const alert = await createAIAlert(patientId, medicineId, aiAnalysis, pattern);

        return {
            triggered: true,
            alert,
            analysis: aiAnalysis,
            pattern
        };

    } catch (error) {
        console.error("Error checking medicine usage pattern:", error.message);
        return { triggered: false, error: error.message };
    }
};

/**
 * Analyze purchase pattern to detect continuous usage
 */
function analyzePurchasePattern(purchases, medicineId) {
    const relevantPurchases = purchases.map(p => ({
        date: new Date(p.createdAt),
        quantity: p.medicines.find(m => m.medicineId.toString() === medicineId.toString())?.quantity || 0
    }));

    // Calculate days between purchases
    const daysBetween = [];
    for (let i = 0; i < relevantPurchases.length - 1; i++) {
        const days = Math.floor(
            (relevantPurchases[i].date - relevantPurchases[i + 1].date) / (1000 * 60 * 60 * 24)
        );
        daysBetween.push(days);
    }

    const avgDaysBetweenPurchases = daysBetween.length > 0
        ? Math.round(daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length)
        : 0;

    const totalDays = Math.floor(
        (relevantPurchases[0].date - relevantPurchases[relevantPurchases.length - 1].date) / (1000 * 60 * 60 * 24)
    );

    // Check if purchases are regular (continuous usage pattern)
    const isContinuous = daysBetween.length >= 1 && avgDaysBetweenPurchases <= 90;

    return {
        isContinuous,
        continuousDays: totalDays,
        avgDaysBetweenPurchases,
        purchaseCount: relevantPurchases.length,
        lastPurchaseDate: relevantPurchases[0].date,
        firstPurchaseDate: relevantPurchases[relevantPurchases.length - 1].date
    };
}

/**
 * Create alert in dashboard based on AI analysis
 */
async function createAIAlert(patientId, medicineId, analysis, pattern) {
    let alertType = "ai_medication_warning";
    let severity = analysis.severity || "medium";
    let title = `AI Health Alert: Continuous ${analysis.medicineName || "Medicine"} Usage`;
    let message = "";

    if (analysis.severity === "high") {
        title = "⚠️ Important: Consult Doctor About Your Medication";
        message = `You've been taking this medicine for ${pattern.continuousDays} days without reported effects. ${analysis.recommendation || "Please consult your doctor."} Potential concerns: ${analysis.potentialSideEffects || "Unknown effects possible."}`;
        alertType = "medication_side_effect_warning";
    } else if (analysis.severity === "medium") {
        message = `After ${pattern.continuousDays} days of continuous use, consider checking with your doctor. ${analysis.recommendation || "Monitor for any changes."}`;
    } else {
        message = `Regular check-in recommended for your medication regimen. ${analysis.recommendation || "Continue as prescribed."}`;
    }

    // Add drug interaction warning if found
    if (analysis.drugInteractions && analysis.drugInteractions !== "Not specified") {
        message += ` Drug Interaction Alert: ${analysis.drugInteractions}`;
        severity = "high";
    }

    const alert = await alertModel.create({
        patientId,
        medicineId,
        alertType,
        title,
        message,
        severity,
        isRead: false,
        isActive: true,
        aiAnalysis: {
            effectsShouldBeVisible: analysis.effectsShouldBeVisible,
            potentialSideEffects: analysis.potentialSideEffects,
            drugInteractions: analysis.drugInteractions,
            recommendation: analysis.recommendation,
            continuousDays: pattern.continuousDays,
            avgDaysBetweenPurchases: pattern.avgDaysBetweenPurchases,
            rawAnalysis: analysis.rawAnalysis
        }
    });

    return alert;
}

/**
 * Scheduled job: Check all patients with continuous medicine usage
 * Run daily or weekly depending on your needs
 */
export const runMedicationCheckJob = async () => {
    try {
        console.log("🔍 Starting medication usage check job...");

        // Get all active patients
        const patients = await userModel.find({ role: "patient", isActive: true });

        let checksRun = 0;
        let alertsCreated = 0;

        for (const patient of patients) {
            // Get all unique medicines this patient has purchased
            const purchases = await purchaseModel.find({ patientId: patient._id });
            
            const medicineIds = new Set();
            purchases.forEach(p => {
                p.medicines.forEach(m => {
                    medicineIds.add(m.medicineId.toString());
                });
            });

            // Check each medicine
            for (const medicineId of medicineIds) {
                const result = await checkMedicineUsagePattern(patient._id, medicineId);
                checksRun++;

                if (result.triggered) {
                    alertsCreated++;
                    console.log(`✅ Alert created for patient ${patient.patientId} - Medicine: ${medicineId}`);
                }
            }
        }

        console.log(`✅ Medication check job completed. Checks: ${checksRun}, Alerts Created: ${alertsCreated}`);
        return { checksRun, alertsCreated };

    } catch (error) {
        console.error("❌ Medication check job failed:", error.message);
        throw error;
    }
};

/**
 * Get continuous usage statistics for a patient
 */
export const getPatientMedicationStats = async (patientId) => {
    try {
        const purchases = await purchaseModel.find({ patientId });
        const medicines = new Map();

        // Group by medicine
        purchases.forEach(p => {
            p.medicines.forEach(m => {
                const key = m.medicineId.toString();
                if (!medicines.has(key)) {
                    medicines.set(key, {
                        medicineId: m.medicineId,
                        name: m.medicineName,
                        purchases: [],
                        totalQuantity: 0
                    });
                }
                const medicine = medicines.get(key);
                medicine.purchases.push(new Date(p.createdAt));
                medicine.totalQuantity += m.quantity;
            });
        });

        // Calculate stats for each medicine
        const stats = [];
        medicines.forEach((med, key) => {
            const pattern = analyzePurchasePattern(
                purchases.filter(p => p.medicines.some(m => m.medicineId.toString() === key)),
                key
            );

            stats.push({
                medicineId: key,
                name: med.name,
                totalPurchases: med.purchases.length,
                totalQuantity: med.totalQuantity,
                pattern,
                lastPurchase: med.purchases[0],
                firstPurchase: med.purchases[med.purchases.length - 1]
            });
        });

        return stats.sort((a, b) => b.pattern.continuousDays - a.pattern.continuousDays);

    } catch (error) {
        console.error("Error getting medication stats:", error.message);
        throw error;
    }
};

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default {
    checkMedicineUsagePattern,
    runMedicationCheckJob,
    getPatientMedicationStats
};

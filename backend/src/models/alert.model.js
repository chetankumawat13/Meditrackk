import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "medicine", required: true },
    alertType: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    aiAnalysis: {
        effectsShouldBeVisible: Boolean,
        potentialSideEffects: mongoose.Schema.Types.Mixed,
        drugInteractions: mongoose.Schema.Types.Mixed,
        recommendation: mongoose.Schema.Types.Mixed,
        continuousDays: Number,
        avgDaysBetweenPurchases: Number,
        rawAnalysis: String,
    },
    doctorConsultationStatus: {
        type: String,
        enum: ["pending", "scheduled", "completed", "not_needed"],
        default: "pending",
    },
    doctorNotes: String,
}, { timestamps: true });

alertSchema.index({ patientId: 1, medicineId: 1, alertType: 1, createdAt: -1 });

const alertModel = mongoose.model("alert", alertSchema);

export default alertModel;

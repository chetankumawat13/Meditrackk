import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        unique: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store",
        required: true
    },
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchase"
    },
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "medicine"
    },
    medicineName: String,
    issueType: {
        type: String,
        enum: ["expired", "damaged", "wrong_medicine", "quality_issue", "quantity_mismatch", "other"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["submitted", "acknowledged", "investigating", "resolved", "rejected"],
        default: "submitted"
    },
    resolution: String,
    refundAmount: Number,
    attachments: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date,
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const reportModel = mongoose.model("report", reportSchema);

export default reportModel;

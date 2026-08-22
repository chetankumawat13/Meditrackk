import mongoose from "mongoose";

const shareAccessSchema = new mongoose.Schema({
    shareCode: {
        type: String,
        unique: true,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    accessibleTo: {
        type: String,
        enum: ["doctor", "hospital", "pharmacy", "public"],
        default: "doctor"
    },
    accessibleEmail: String,
    dataType: {
        type: [String],
        enum: ["purchases", "reports", "all"],
        default: ["all"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    accessLogs: [{
        accessedBy: String,
        accessedAt: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        userAgent: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const shareAccessModel = mongoose.model("shareAccess", shareAccessSchema);

export default shareAccessModel;

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store",
        required: true
    },
    name: {
        type: String,
        required: [true, "Medicine name is required"]
    },
    genericName: String,
    manufacturer: String,
    composition: String,
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        default: 0
    },
    unit: {
        type: String,
        enum: ["tablet", "capsule", "injection", "liquid", "powder", "drops", "strip", "pack"],
        default: "tablet"
    },
    batchNumber: String,
    expiryDate: {
        type: Date,
        required: [true, "Expiry date is required"]
    },
    hsn: String,
    gst: {
        type: Number,
        default: 0
    },
    description: String,
    requiresPrescription: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const medicineModel = mongoose.model("medicine", medicineSchema);

export default medicineModel;

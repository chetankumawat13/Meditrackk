import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
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
    medicines: [{
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "medicine",
            required: true
        },
        medicineName: String,
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        gst: Number,
        amount: Number
    }],
    subtotal: Number,
    gstAmount: Number,
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi", "online"],
        default: "cash"
    },
    status: {
        type: String,
        enum: ["completed", "pending", "cancelled"],
        default: "completed"
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const purchaseModel = mongoose.model("purchase", purchaseSchema);

export default purchaseModel;

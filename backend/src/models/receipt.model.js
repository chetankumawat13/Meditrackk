import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        unique: true
    },
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchase",
        required: true
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
    storeDetails: {
        storeName: String,
        storeEmail: String,
        storeContact: String,
        storeAddress: mongoose.Schema.Types.Mixed
    },
    patientDetails: {
        name: String,
        contact: String,
        email: String,
        address: mongoose.Schema.Types.Mixed
    },
    medicines: [{
        name: String,
        quantity: Number,
        price: Number,
        gst: Number,
        amount: Number
    }],
    subtotal: Number,
    gstAmount: Number,
    total: Number,
    paymentMethod: String,
    receiptDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const receiptModel = mongoose.model("receipt", receiptSchema);

export default receiptModel;

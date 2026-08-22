import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: [true, "Store name is required"],
    },
    storeContact: {
        type: String,
        required: [true, "Store contact is required"],
        unique: [true, "Store already exists with this contact number"],
    },
    storeEmail: {
        type: String,
        required: [true, "Store email is required"],
        unique: [true, "Store already exists with this email"],
        lowercase: true
    },
    storeLicenseNumber: {
        type: String,
        required: [true, "License number is required"],
        unique: [true, "Store already exists with this license number"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    storeAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
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

const storeModel = mongoose.model("store", storeSchema);

export default storeModel;
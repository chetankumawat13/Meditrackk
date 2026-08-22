import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "User already exists with this email"],
        sparse: true,
        lowercase: true,
    },
    contact: {
        type: String,
        unique: [true, "User already exists with this contact number"],
        required: [true, "Contact number is required"],
    },
    fullname: {
        type: String,
        required: [true, "Full name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["patient"],
        default: "patient"
    },
    patientId: {
        type: String,
        unique: true,
    },
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    address: {
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

const userModel = mongoose.model("user", userSchema);

export default userModel;
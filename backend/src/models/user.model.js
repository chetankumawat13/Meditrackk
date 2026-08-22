import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:[true,"With this email account already created"],
    },
    contact:{
        type:String,
        unique:[true,"With this contact number account already created"],
        required:[true,"contact is required to create account"],
    },
    fullname:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:["patient","store"],
        default:"patient"
    },
    patientId:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
    gender:{
        type:String
    },

    address:{
        street:String,
        city:String,
        state:String,
        pincode:String
    },
    isActive:{
        type:Boolean
    },
    createdAt:Date,
    updateAt:Date
})

const userModel = mongoose.model("user",userSchema);

export default userModel;
import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:[true,"store name is required to create account"],
        
    },
    storeContact:{
        type:String,
        required:[true,"store contact is required to create account"],
        unique:[true,"With this contact number account already created"],
    },
    storeEmail:{
        type:String,
        required:[true,"store email is required to create account"],
        unique:[true,"With this email account already created"]
        
    },
    storeLicenseNumber:{
        type:String,
        required:[true,"store license number is required to create account"],
        unique:[true,"With this license number account already created"]
    },
    storeAddress:{
        street:String,
        city:String,
        state:String,
        pincode:String
    },
    password:{
        type:String,
        required:[true,"password is required to create account"]
    }
    ,
    isActive:{
        type:Boolean
    },
    createdAt:Date,
    updateAt:Date
})

const storeModel = mongoose.model("store",storeSchema);

export default storeModel;
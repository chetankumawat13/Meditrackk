import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import storeModel from "../models/store.model.js";







export async function registerPatientController(req,res){
    const {fullname,contact,email,password,dateOfBirth,gender,address} = req.body;



    const userExist  =  await userModel.findOne({
        $or:[
            {
                email
            },
            {
                contact
            }
        ]
    })

    if(userExist){
        return res.status(400).json({
            message:"user already exist with this email or contact"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const patientId = `P-${Date.now()}`;

    const user = await userModel.create(
        {
            fullname,
            contact,
            email,
            password:hashedPassword,
            dateOfBirth,
            gender,
            address,
            patientId,
            role:"patient"
        }
    )

    const token = jwt.sign(
        {
            id:user._id,
            email:user.email
        },
        config.JWT_SECRET,
        {
            expiresIn:'7d'
        }
    );

    res.cookie('token',token);

    res.status(200).json({
        success:true,
        message:"User registered successfully",
        token:token,
        user:user
    })

}

export async function registerStoreController(req,res){
    const {storeName,storeLicenseNumber,storeContact,storeEmail,password} = req.body;

    const storeExist  = await storeModel.findOne({
        $or:[
            {
                storeLicenseNumber
            },
            {
                storeEmail
            }
        ]
    })

    if(storeExist){
        return res.status(400).json({
            message:"store already exist with this email or license number"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const store = await storeModel.create(
        {
            storeName,
            storeLicenseNumber,
            storeContact,
            storeEmail,
            password:hashedPassword,
        }
    )

    const token = jwt.sign(
        {
            id:store._id,
            storeEmail:store.storeEmail
        },
        config.JWT_SECRET,
        {
            expiresIn:'7d'
        }
    );

    res.cookie('token',token);

    res.status(200).json({
        success:true,
        message:"Store registered successfully",
        token:token,
        store:store
    })  

};


export async function patientLoginController(req,res){
    const {email,password} = req.body;



    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const isPasswordMatched = await bcrypt.compare(password,user.password);

    if(!isPasswordMatched){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign({
        id:user._id,
        email:user.email
    },
    config.JWT_SECRET,
    {
        expiresIn:'7d'
    })
    
    res.cookie('token',token);

    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        token:token,
        user:user
    })


    
} 

export async function storeLoginController(req,res){
    const {storeEmail,password} = req.body;

    const store = await storeModel.findOne({storeEmail});

    if(!store){
        return res.status(404).json({
            message:"invalid email or password"
        })
    }

    const isPasswordMatched = await bcrypt.compare(password,store.password);

    if(!isPasswordMatched){
        return res.status(404).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign({
        id:store._id,
        storeEmail:store.storeEmail
    },
    config.JWT_SECRET,
    {
        expiresIn:'7d'
    })

    res.cookie('token',token);

    res.status(200).json({
        success:true,
        message:"Store logged in successfully",
        token:token,
        store:store
    })
}   

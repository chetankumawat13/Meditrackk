import userModel from "../models/user.model.js";
import storeModel from "../models/store.model.js";
import { config } from "../config/config.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import redis from "../config/cache.js";

export const registerPatient = async (req, res) => {
    try {
        const { fullname, contact, email, password, dateOfBirth, gender, address } = req.body;

        if (!fullname || !contact || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const userExists = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email or contact"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const patientId = `P-${Date.now()}`;

        const user = await userModel.create({
            fullname,
            contact,
            email,
            password: hashedPassword,
            dateOfBirth,
            gender,
            address,
            patientId,
            role: "patient"
        });

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: "patient"
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            token,
            user: {
                id: user._id,
                patientId: user.patientId,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const registerStore = async (req, res) => {
    try {
        const { storeName, storeLicenseNumber, storeContact, storeEmail, password, storeAddress } = req.body;

        if (!storeName || !storeContact || !storeEmail || !storeLicenseNumber || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const storeExists = await storeModel.findOne({
            $or: [{ storeLicenseNumber }, { storeEmail }, { storeContact }]
        });

        if (storeExists) {
            return res.status(400).json({
                success: false,
                message: "Store already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const store = await storeModel.create({
            storeName,
            storeLicenseNumber,
            storeContact,
            storeEmail,
            password: hashedPassword,
            storeAddress
        });

        const token = jwt.sign(
            {
                id: store._id,
                storeEmail: store.storeEmail,
                role: "store"
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(201).json({
            success: true,
            message: "Store registered successfully",
            token,
            store: {
                id: store._id,
                storeName: store.storeName,
                storeEmail: store.storeEmail,
                storeContact: store.storeContact,
                role: "store"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const patientLogin = async (req, res) => {
    try {
        const { email, contact, password } = req.body;

        if (!password || (!email && !contact)) {
            return res.status(400).json({
                success: false,
                message: "Email/Contact and password required"
            });
        }

        const user = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: "patient"
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            message: "Patient logged in successfully",
            token,
            user: {
                id: user._id,
                patientId: user.patientId,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const storeLogin = async (req, res) => {
    try {
        const { storeEmail, password } = req.body;

        if (!storeEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const store = await storeModel.findOne({ storeEmail });

        if (!store) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, store.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: store._id,
                storeEmail: store.storeEmail,
                role: "store"
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            message: "Store logged in successfully",
            token,
            store: {
                id: store._id,
                storeName: store.storeName,
                storeEmail: store.storeEmail,
                storeContact: store.storeContact,
                role: "store"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req,res) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({
                success: false,
                message: "No token found"
            });
        }

        res.clearCookie('token');
        
        await redis.set(
            token,
            Date.now().toString()
        );


        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
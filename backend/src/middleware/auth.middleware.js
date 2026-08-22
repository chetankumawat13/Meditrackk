import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export const verifyPatient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'patient' || !req.user.storeEmail) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. Patient only"
            });
        }
    });
};

export const verifyStore = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'store' || req.user.storeEmail) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. Store only"
            });
        }
    });
};

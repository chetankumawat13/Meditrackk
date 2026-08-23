import shareAccessModel from "../models/shareAccess.model.js";
import purchaseModel from "../models/purchase.model.js";
import reportModel from "../models/report.model.js";
import userModel from "../models/user.model.js";
import crypto from "crypto";

const createUniqueShare = async (shareData) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const shareCode = `MED-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
        try {
            return await shareAccessModel.create({ ...shareData, shareCode });
        } catch (error) {
            if (error.code !== 11000 || attempt === 4) throw error;
        }
    }
};

export const generateShareCode = async (req, res) => {
    try {
        const { accessibleTo, accessibleEmail, dataType, expiresIn } = req.body;

        let expiresAt = new Date();
        const days = Number(expiresIn);
        if (Number.isFinite(days) && days > 0 && days <= 90) {
            expiresAt.setDate(expiresAt.getDate() + days);
        } else {
            expiresAt.setDate(expiresAt.getDate() + 30);
        }

        const selectedData = Array.isArray(dataType) && dataType.length > 0
            ? dataType
            : ["all"];
        const share = await createUniqueShare({
            patientId: req.user.id,
            accessibleTo: accessibleTo || "doctor",
            accessibleEmail,
            dataType: selectedData,
            expiresAt
        });

        res.status(201).json({
            success: true,
            message: "Share code generated successfully",
            shareCode: share.shareCode,
            expiresAt: share.expiresAt,
            note: "Share this code with the person who needs access to your medical records"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getActiveShareCodes = async (req, res) => {
    try {
        const shares = await shareAccessModel.find({
            patientId: req.user.id,
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).select('shareCode accessibleTo accessibleEmail dataType expiresAt createdAt');

        res.status(200).json({
            success: true,
            count: shares.length,
            shares
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getShareAccessLogs = async (req, res) => {
    try {
        const shares = await shareAccessModel.find({
            patientId: req.user.id
        }).select('shareCode accessLogs createdAt');

        const logs = [];
        shares.forEach(share => {
            share.accessLogs.forEach(log => {
                logs.push({
                    shareCode: share.shareCode,
                    accessedBy: log.accessedBy,
                    accessedAt: log.accessedAt,
                    ipAddress: log.ipAddress
                });
            });
        });

        logs.sort((a, b) => new Date(b.accessedAt) - new Date(a.accessedAt));

        res.status(200).json({
            success: true,
            totalAccess: logs.length,
            logs: logs.slice(0, 50)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const revokeShareCode = async (req, res) => {
    try {
        const { shareCode } = req.params;
        const share = await shareAccessModel.findOne({ shareCode });

        if (!share) {
            return res.status(404).json({
                success: false,
                message: "Share code not found"
            });
        }

        if (share.patientId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await shareAccessModel.findByIdAndUpdate(share._id, { isActive: false });

        res.status(200).json({
            success: true,
            message: "Share code revoked successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const accessSharedHistory = async (req, res) => {
    try {
        const { shareCode } = req.params;
        const share = await shareAccessModel.findOne({
            shareCode,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!share) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired share code"
            });
        }

        const patient = await userModel.findById(share.patientId);
        const data = {};

        if (share.dataType.includes("all") || share.dataType.includes("medicines") || share.dataType.includes("purchases")) {
            data.purchases = await purchaseModel.find({
                patientId: share.patientId
            }).select('-patientId').populate('storeId', 'storeName');
        }

        if (share.dataType.includes("all") || share.dataType.includes("reports")) {
            data.reports = await reportModel.find({
                patientId: share.patientId
            }).select('-patientId');
        }

        share.accessLogs.push({
            accessedBy: req.query.accessedBy || "Unknown",
            accessedAt: new Date(),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        await share.save();

        const response = {
            success: true,
            medicalRecords: data,
            accessedAt: new Date()
        };

        if (share.dataType.includes("all") || share.dataType.includes("contact")) {
            response.patient = {
                name: patient.fullname,
                patientId: patient.patientId,
                contact: patient.contact,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                address: patient.address
            };
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const redeemShareCode = async (req, res, next) => {
    req.query.accessedBy = req.user.fullname || req.user.email || req.user.id;
    return accessSharedHistory(req, res, next);
};

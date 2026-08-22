import shareAccessModel from "../models/shareAccess.model.js";
import purchaseModel from "../models/purchase.model.js";
import reportModel from "../models/report.model.js";
import userModel from "../models/user.model.js";

export const generateShareCode = async (req, res) => {
    try {
        const { accessibleTo, accessibleEmail, dataType, expiresIn } = req.body;

        const shareCode = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        let expiresAt = new Date();
        if (expiresIn) {
            expiresAt.setDate(expiresAt.getDate() + expiresIn);
        } else {
            expiresAt.setDate(expiresAt.getDate() + 30);
        }

        const share = await shareAccessModel.create({
            shareCode,
            patientId: req.user.id,
            accessibleTo: accessibleTo || "doctor",
            accessibleEmail,
            dataType: dataType || ["all"],
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

        if (share.dataType.includes("all") || share.dataType.includes("purchases")) {
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

        res.status(200).json({
            success: true,
            patient: {
                name: patient.fullname,
                patientId: patient.patientId,
                contact: patient.contact,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                address: patient.address
            },
            medicalRecords: data,
            accessedAt: new Date()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

import reportModel from "../models/report.model.js";
import purchaseModel from "../models/purchase.model.js";
import userModel from "../models/user.model.js";

export const createReport = async (req, res) => {
    try {
        const { purchaseId, medicineId, medicineName, issueType, description, severity, attachments } = req.body;

        if (!issueType || !description) {
            return res.status(400).json({
                success: false,
                message: "Issue type and description required"
            });
        }

        let storeId = null;
        if (purchaseId) {
            const purchase = await purchaseModel.findById(purchaseId);
            if (purchase) {
                storeId = purchase.storeId;
            }
        }

        const report = await reportModel.create({
            reportId: `RPT-${Date.now()}`,
            patientId: req.user.id,
            storeId,
            purchaseId,
            medicineId,
            medicineName,
            issueType,
            description,
            severity: severity || "medium",
            status: "submitted",
            attachments
        });

        res.status(201).json({
            success: true,
            message: "Report submitted successfully",
            report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPatientReports = async (req, res) => {
    try {
        const reports = await reportModel.find({ patientId: req.user.id })
            .populate('storeId', 'storeName storeContact')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStoreReports = async (req, res) => {
    try {
        const reports = await reportModel.find({ storeId: req.user.id })
            .populate('patientId', 'fullname contact email patientId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportModel.findById(id)
            .populate('patientId')
            .populate('storeId');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution, refundAmount } = req.body;

        const report = await reportModel.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        if (report.storeId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updateData = { status };
        if (resolution) updateData.resolution = resolution;
        if (refundAmount) updateData.refundAmount = refundAmount;
        if (status === "resolved") updateData.resolvedAt = new Date();

        const updated = await reportModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            report: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getReportStats = async (req, res) => {
    try {
        const reports = await reportModel.find({ storeId: req.user.id });

        const stats = {
            total: reports.length,
            submitted: reports.filter(r => r.status === 'submitted').length,
            acknowledged: reports.filter(r => r.status === 'acknowledged').length,
            investigating: reports.filter(r => r.status === 'investigating').length,
            resolved: reports.filter(r => r.status === 'resolved').length,
            rejected: reports.filter(r => r.status === 'rejected').length,
            bySeverity: {
                low: reports.filter(r => r.severity === 'low').length,
                medium: reports.filter(r => r.severity === 'medium').length,
                high: reports.filter(r => r.severity === 'high').length
            },
            byType: {
                expired: reports.filter(r => r.issueType === 'expired').length,
                damaged: reports.filter(r => r.issueType === 'damaged').length,
                wrong_medicine: reports.filter(r => r.issueType === 'wrong_medicine').length,
                quality_issue: reports.filter(r => r.issueType === 'quality_issue').length,
                quantity_mismatch: reports.filter(r => r.issueType === 'quantity_mismatch').length,
                other: reports.filter(r => r.issueType === 'other').length
            }
        };

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

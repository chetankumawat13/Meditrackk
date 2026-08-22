import storeModel from "../models/store.model.js";
import purchaseModel from "../models/purchase.model.js";
import medicineModel from "../models/medicine.model.js";
import reportModel from "../models/report.model.js";
import userModel from "../models/user.model.js";

export const getStoreDashboard = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const medicines = await medicineModel.find({ storeId: req.user.id });
        const purchases = await purchaseModel.find({ storeId: req.user.id });
        const reports = await reportModel.find({ storeId: req.user.id });

        const totalMedicines = medicines.length;
        const totalStock = medicines.reduce((sum, m) => sum + m.stock, 0);
        const lowStockMedicines = medicines.filter(m => m.stock <= 10);
        const expiringMedicines = medicines.filter(m => {
            const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            return m.expiryDate <= thirtyDaysLater && m.expiryDate >= today;
        });

        const todaysPurchases = purchases.filter(p => {
            const pDate = new Date(p.createdAt);
            pDate.setHours(0, 0, 0, 0);
            return pDate.getTime() === today.getTime();
        });
        const todaysSales = todaysPurchases.reduce((sum, p) => sum + p.total, 0);

        const patientIds = [...new Set(purchases.map(p => p.patientId.toString()))];
        const totalPatients = patientIds.length;

        const pendingReports = reports.filter(r => 
            r.status !== 'resolved' && r.status !== 'rejected'
        ).length;

        const recentSales = purchases
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const totalRevenue = purchases.reduce((sum, p) => sum + p.total, 0);
        const avgOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;

        res.status(200).json({
            success: true,
            dashboard: {
                stats: {
                    totalMedicines,
                    totalStock,
                    lowStockCount: lowStockMedicines.length,
                    expiringCount: expiringMedicines.length,
                    todaysSales,
                    totalPatients,
                    pendingReports,
                    totalRevenue,
                    avgOrderValue,
                    totalOrders: purchases.length
                },
                alerts: {
                    lowStock: lowStockMedicines.slice(0, 5).map(m => ({
                        id: m._id,
                        name: m.name,
                        stock: m.stock,
                        minStock: 10
                    })),
                    expiring: expiringMedicines.slice(0, 5).map(m => ({
                        id: m._id,
                        name: m.name,
                        expiryDate: m.expiryDate
                    }))
                },
                recentSales: recentSales.map(p => ({
                    id: p._id,
                    purchaseId: p.purchaseId,
                    total: p.total,
                    date: p.createdAt,
                    medicinesCount: p.medicines.length
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPatientDashboard = async (req, res) => {
    try {
        const patient = await userModel.findById(req.user.id);
        const purchases = await purchaseModel.find({ patientId: req.user.id })
            .sort({ createdAt: -1 });
        const reports = await reportModel.find({ patientId: req.user.id });

        const recentMedicines = purchases
            .slice(0, 5)
            .flatMap(p => p.medicines.map(m => ({
                name: m.medicineName,
                date: p.createdAt,
                purchaseId: p._id,
                store: p.storeId
            })));

        const currentMedications = purchases
            .slice(0, 5)
            .flatMap(p => p.medicines.map(m => ({
                name: m.medicineName,
                dosage: m.quantity,
                frequency: 'As per purchase record',
                purchaseId: p._id
            })));

        const activeAlerts = reports.filter(r => r.status !== 'resolved').length;

        res.status(200).json({
            success: true,
            dashboard: {
                patient: {
                    name: patient.fullname,
                    patientId: patient.patientId,
                    contact: patient.contact,
                    email: patient.email
                },
                stats: {
                    recentMedicinesCount: recentMedicines.length,
                    activeAlertsCount: activeAlerts,
                    totalPurchases: purchases.length,
                    activeMedicationsCount: currentMedications.length
                },
                recentMedicines,
                currentMedications,
                medicationHistory: purchases.slice(0, 10).map(p => ({
                    id: p._id,
                    purchaseId: p.purchaseId,
                    date: p.createdAt,
                    medicines: p.medicines.map(m => m.medicineName).join(', '),
                    total: p.total
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDetailedAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const purchases = await purchaseModel.find({
            storeId: req.user.id,
            createdAt: { $gte: startDate }
        });

        const medicines = await medicineModel.find({ storeId: req.user.id });

        const dailyRevenue = {};
        purchases.forEach(p => {
            const date = new Date(p.createdAt).toISOString().split('T')[0];
            dailyRevenue[date] = (dailyRevenue[date] || 0) + p.total;
        });

        const topMedicines = medicines
            .map(m => ({
                name: m.name,
                price: m.price,
                stock: m.stock
            }))
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            analytics: {
                period: `${days} days`,
                totalRevenue: Object.values(dailyRevenue).reduce((sum, val) => sum + val, 0),
                totalOrders: purchases.length,
                dailyRevenue,
                topMedicines,
                medicineCount: medicines.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

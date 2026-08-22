import storeModel from "../models/store.model.js";
import userModel from "../models/user.model.js";
import purchaseModel from "../models/purchase.model.js";

export const getStoreProfile = async (req, res) => {
    try {
        const store = await storeModel.findById(req.user.id);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        res.status(200).json({
            success: true,
            store: {
                id: store._id,
                storeName: store.storeName,
                storeEmail: store.storeEmail,
                storeContact: store.storeContact,
                storeLicenseNumber: store.storeLicenseNumber,
                storeAddress: store.storeAddress,
                isActive: store.isActive,
                createdAt: store.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateStoreProfile = async (req, res) => {
    try {
        const { storeName, storeContact, storeAddress } = req.body;

        const updateData = {};
        if (storeName) updateData.storeName = storeName;
        if (storeContact) updateData.storeContact = storeContact;
        if (storeAddress) updateData.storeAddress = storeAddress;

        const updated = await storeModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Store profile updated",
            store: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStoreDashboard = async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ storeId: req.user.id });
        const patients = await userModel.find({
            _id: { $in: purchases.map(p => p.patientId) }
        });

        const totalRevenue = purchases.reduce((sum, p) => sum + p.total, 0);
        const totalOrders = purchases.length;
        const totalPatients = patients.length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysSales = purchases.filter(p => {
            const pDate = new Date(p.createdAt);
            pDate.setHours(0, 0, 0, 0);
            return pDate.getTime() === today.getTime();
        }).reduce((sum, p) => sum + p.total, 0);

        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const last7DaysSales = purchases.filter(p => new Date(p.createdAt) > last7Days)
            .reduce((sum, p) => sum + p.total, 0);

        res.status(200).json({
            success: true,
            dashboard: {
                totalRevenue,
                totalOrders,
                totalPatients,
                todaysSales,
                last7DaysSales,
                avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStorePatients = async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ storeId: req.user.id });
        const patientIds = [...new Set(purchases.map(p => p.patientId.toString()))];

        const patients = await userModel.find({
            _id: { $in: patientIds }
        }).select('_id fullname contact email patientId address createdAt');

        const patientsWithStats = patients.map(patient => {
            const patientPurchases = purchases.filter(p => p.patientId.toString() === patient._id.toString());
            return {
                ...patient.toObject(),
                totalPurchases: patientPurchases.length,
                totalSpent: patientPurchases.reduce((sum, p) => sum + p.total, 0),
                lastPurchase: patientPurchases.length > 0 ? patientPurchases[0].createdAt : null
            };
        });

        res.status(200).json({
            success: true,
            count: patientsWithStats.length,
            patients: patientsWithStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPatientProfile = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await userModel.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        const purchases = await purchaseModel.find({
            patientId: patientId,
            storeId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            patient: {
                id: patient._id,
                fullname: patient.fullname,
                contact: patient.contact,
                email: patient.email,
                patientId: patient.patientId,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                address: patient.address,
                totalPurchases: purchases.length,
                totalSpent: purchases.reduce((sum, p) => sum + p.total, 0),
                lastPurchase: purchases.length > 0 ? purchases[0].createdAt : null,
                purchases: purchases
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllStores = async (req, res) => {
    try {
        const { search, city } = req.query;
        let filter = { isActive: true };

        if (search) {
            filter.$or = [
                { storeName: { $regex: search, $options: 'i' } },
                { storeEmail: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            filter['storeAddress.city'] = { $regex: city, $options: 'i' };
        }

        const stores = await storeModel.find(filter).select('_id storeName storeEmail storeContact storeAddress createdAt');

        res.status(200).json({
            success: true,
            count: stores.length,
            stores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

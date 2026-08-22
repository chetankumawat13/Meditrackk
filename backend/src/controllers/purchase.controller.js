import purchaseModel from "../models/purchase.model.js";
import receiptModel from "../models/receipt.model.js";
import medicineModel from "../models/medicine.model.js";
import userModel from "../models/user.model.js";
import storeModel from "../models/store.model.js";

export const createPurchase = async (req, res) => {
    try {
        const { medicines, paymentMethod, storeId, notes } = req.body;

        if (!medicines || medicines.length === 0 || !storeId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        let subtotal = 0;
        let gstAmount = 0;
        const medicineDetails = [];

        for (const item of medicines) {
            const medicine = await medicineModel.findById(item.medicineId);

            if (!medicine) {
                return res.status(404).json({
                    success: false,
                    message: `Medicine not found: ${item.medicineId}`
                });
            }

            if (medicine.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${medicine.name}`
                });
            }

            const amount = medicine.price * item.quantity;
            const itemGst = (amount * (medicine.gst || 0)) / 100;

            medicineDetails.push({
                medicineId: medicine._id,
                medicineName: medicine.name,
                quantity: item.quantity,
                price: medicine.price,
                gst: medicine.gst || 0,
                amount: amount + itemGst
            });

            subtotal += amount;
            gstAmount += itemGst;

            await medicineModel.findByIdAndUpdate(
                item.medicineId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const total = subtotal + gstAmount;
        const purchaseId = `ORD-${Date.now()}`;

        const purchase = await purchaseModel.create({
            purchaseId,
            patientId: req.user.id,
            storeId,
            medicines: medicineDetails,
            subtotal,
            gstAmount,
            total,
            paymentMethod,
            notes,
            status: "completed"
        });

        const patient = await userModel.findById(req.user.id);
        const store = await storeModel.findById(storeId);

        await receiptModel.create({
            receiptNumber: `RCP-${Date.now()}`,
            purchaseId: purchase._id,
            patientId: req.user.id,
            storeId,
            storeDetails: {
                storeName: store.storeName,
                storeEmail: store.storeEmail,
                storeContact: store.storeContact,
                storeAddress: store.storeAddress
            },
            patientDetails: {
                name: patient.fullname,
                contact: patient.contact,
                email: patient.email,
                address: patient.address
            },
            medicines: medicineDetails,
            subtotal,
            gstAmount,
            total,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            message: "Purchase completed successfully",
            purchase
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPatientPurchases = async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ patientId: req.user.id })
            .populate('storeId', 'storeName storeContact storeEmail')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            purchases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStorePurchases = async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ storeId: req.user.id })
            .populate('patientId', 'fullname contact email patientId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            purchases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const purchase = await purchaseModel.findById(id)
            .populate('patientId')
            .populate('storeId');

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        if (purchase.patientId._id.toString() !== req.user.id && purchase.storeId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            purchase
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getReceipt = async (req, res) => {
    try {
        const { purchaseId } = req.params;
        const receipt = await receiptModel.findOne({ purchaseId });

        if (!receipt) {
            return res.status(404).json({
                success: false,
                message: "Receipt not found"
            });
        }

        res.status(200).json({
            success: true,
            receipt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPurchaseStats = async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ storeId: req.user.id });
        
        const totalSales = purchases.reduce((sum, p) => sum + p.total, 0);
        const totalOrders = purchases.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentSales = purchases.filter(p => new Date(p.createdAt) > last30Days)
            .reduce((sum, p) => sum + p.total, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalSales,
                totalOrders,
                avgOrderValue,
                last30DaysSales: recentSales
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createPurchaseByStore = async (req, res) => {
    try {
        const { medicines, paymentMethod, patientContact, patientName, notes } = req.body;
        const storeId = req.user.id;

        if (!medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Missing medicines"
            });
        }

        if (!patientContact && !patientName) {
            return res.status(400).json({
                success: false,
                message: "Patient contact or name required"
            });
        }

        let patient = null;
        if (patientContact) {
            patient = await userModel.findOne({ contact: patientContact });
        }

        if (!patient && patientContact) {
            return res.status(404).json({
                success: false,
                message: "Patient not found with this contact number"
            });
        }

        let subtotal = 0;
        let gstAmount = 0;
        const medicineDetails = [];

        for (const item of medicines) {
            const medicine = await medicineModel.findById(item.medicineId);

            if (!medicine) {
                return res.status(404).json({
                    success: false,
                    message: `Medicine not found: ${item.medicineId}`
                });
            }

            if (medicine.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${medicine.name}`
                });
            }

            const amount = medicine.price * item.quantity;
            const itemGst = (amount * (medicine.gst || 0)) / 100;

            medicineDetails.push({
                medicineId: medicine._id,
                medicineName: medicine.name,
                quantity: item.quantity,
                price: medicine.price,
                gst: medicine.gst || 0,
                amount: amount + itemGst
            });

            subtotal += amount;
            gstAmount += itemGst;

            await medicineModel.findByIdAndUpdate(
                item.medicineId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const total = subtotal + gstAmount;
        const purchaseId = `ORD-${Date.now()}`;

        if (!patient) {
            return res.status(400).json({
                success: false,
                message: "Patient not found. Please register patient first or provide valid contact number."
            });
        }

        const purchase = await purchaseModel.create({
            purchaseId,
            patientId: patient._id,
            storeId,
            medicines: medicineDetails,
            subtotal,
            gstAmount,
            total,
            paymentMethod: paymentMethod || "cash",
            notes,
            status: "completed"
        });

        const store = await storeModel.findById(storeId);

        await receiptModel.create({
            receiptNumber: `RCP-${Date.now()}`,
            purchaseId: purchase._id,
            patientId: patient._id,
            storeId,
            storeDetails: {
                storeName: store.storeName,
                storeEmail: store.storeEmail,
                storeContact: store.storeContact,
                storeAddress: store.storeAddress
            },
            patientDetails: {
                name: patient.fullname,
                contact: patient.contact,
                email: patient.email,
                address: patient.address
            },
            medicines: medicineDetails,
            subtotal,
            gstAmount,
            total,
            paymentMethod: paymentMethod || "cash"
        });

        res.status(201).json({
            success: true,
            message: "Purchase created by store successfully",
            purchase: {
                purchaseId: purchase.purchaseId,
                patientName: patient.fullname,
                patientContact: patient.contact,
                total,
                medicines: medicineDetails,
                createdAt: purchase.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
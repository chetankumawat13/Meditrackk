import medicineModel from "../models/medicine.model.js";
import storeModel from "../models/store.model.js";

export const addMedicine = async (req, res) => {
    try {
        const { name, genericName, manufacturer, composition, price, stock, unit, batchNumber, expiryDate, hsn, gst, description, requiresPrescription } = req.body;

        if (!name || !price || !stock || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const medicine = await medicineModel.create({
            storeId: req.user.id,
            name,
            genericName,
            manufacturer,
            composition,
            price,
            stock,
            unit,
            batchNumber,
            expiryDate,
            hsn,
            gst,
            description,
            requiresPrescription
        });

        res.status(201).json({
            success: true,
            message: "Medicine added successfully",
            medicine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStoreInventory = async (req, res) => {
    try {
        const medicines = await medicineModel.find({ storeId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllMedicines = async (req, res) => {
    try {
        const { search, city, maxPrice } = req.query;
        let filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { genericName: { $regex: search, $options: 'i' } }
            ];
        }

        if (maxPrice) {
            filter.price = { $lte: parseFloat(maxPrice) };
        }

        const medicines = await medicineModel.find(filter)
            .populate('storeId', 'storeName storeContact storeEmail storeAddress')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await medicineModel.findById(id).populate('storeId');

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            success: true,
            medicine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await medicineModel.findById(id);

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        if (medicine.storeId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updated = await medicineModel.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            medicine: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await medicineModel.findById(id);

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        if (medicine.storeId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await medicineModel.findByIdAndUpdate(id, { isActive: false });

        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getLowStockMedicines = async (req, res) => {
    try {
        const threshold = 10;
        const medicines = await medicineModel.find({
            storeId: req.user.id,
            stock: { $lte: threshold },
            isActive: true
        });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getExpiringMedicines = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        const medicines = await medicineModel.find({
            storeId: req.user.id,
            expiryDate: { $lte: thirtyDaysLater, $gte: today },
            isActive: true
        }).sort({ expiryDate: 1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

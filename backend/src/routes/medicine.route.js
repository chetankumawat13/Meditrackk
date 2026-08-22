import { Router } from "express";
import { addMedicine, getStoreInventory, getAllMedicines, getMedicineById, updateMedicine, deleteMedicine, getLowStockMedicines, getExpiringMedicines } from "../controllers/medicine.controller.js";
import { verifyToken, verifyStore, verifyPatient } from "../middleware/auth.middleware.js";

const medicineRouter = Router();

medicineRouter.post('/add', verifyToken, verifyStore, addMedicine);
medicineRouter.get('/store/inventory', verifyToken, verifyStore, getStoreInventory);
medicineRouter.get('/store/low-stock', verifyToken, verifyStore, getLowStockMedicines);
medicineRouter.get('/store/expiring', verifyToken, verifyStore, getExpiringMedicines);
medicineRouter.get('/all', getAllMedicines);
medicineRouter.get('/:id', getMedicineById);
medicineRouter.put('/:id', verifyToken, verifyStore, updateMedicine);
medicineRouter.delete('/:id', verifyToken, verifyStore, deleteMedicine);

export default medicineRouter;

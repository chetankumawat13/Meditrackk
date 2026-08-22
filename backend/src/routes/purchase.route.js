import { Router } from "express";
import { createPurchase, createPurchaseByStore, getPatientPurchases, getStorePurchases, getPurchaseById, getReceipt, getPurchaseStats } from "../controllers/purchase.controller.js";
import { verifyToken, verifyPatient, verifyStore } from "../middleware/auth.middleware.js";

const purchaseRouter = Router();

purchaseRouter.post('/create', verifyToken, createPurchase);
purchaseRouter.post('/create-by-store', verifyToken, verifyStore, createPurchaseByStore);
purchaseRouter.get('/patient/list', verifyToken, verifyPatient, getPatientPurchases);
purchaseRouter.get('/store/list', verifyToken, verifyStore, getStorePurchases);
purchaseRouter.get('/store/stats', verifyToken, verifyStore, getPurchaseStats);
purchaseRouter.get('/:id', verifyToken, getPurchaseById);
purchaseRouter.get('/:purchaseId/receipt', verifyToken, getReceipt);

export default purchaseRouter;
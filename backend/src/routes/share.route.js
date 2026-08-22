import { Router } from "express";
import { generateShareCode, getActiveShareCodes, getShareAccessLogs, revokeShareCode, accessSharedHistory } from "../controllers/share.controller.js";
import { verifyToken, verifyPatient } from "../middleware/auth.middleware.js";

const shareRouter = Router();

shareRouter.post('/generate-code', verifyToken, verifyPatient, generateShareCode);
shareRouter.get('/active-codes', verifyToken, verifyPatient, getActiveShareCodes);
shareRouter.get('/access-logs', verifyToken, verifyPatient, getShareAccessLogs);
shareRouter.put('/revoke/:shareCode', verifyToken, verifyPatient, revokeShareCode);
shareRouter.get('/access/:shareCode', accessSharedHistory);

export default shareRouter;

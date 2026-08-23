import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';

import medicineRouter from './routes/medicine.route.js';
import purchaseRouter from './routes/purchase.route.js';
import reportRouter from './routes/report.route.js';
import storeRouter from './routes/store.route.js';
import userRouter from './routes/user.route.js';
import shareRouter from './routes/share.route.js';
import dashboardRouter from './routes/dashboard.route.js';
import prescriptionRouter from './routes/prescription.route.js';
import { errorHandler } from './middleware/errorHandler.js';


import cors from 'cors';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/medicines', medicineRouter);
app.use('/api/purchases', purchaseRouter);
app.use('/api/reports', reportRouter);
app.use('/api/stores', storeRouter);
app.use('/api/users', userRouter);
app.use('/api/share', shareRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/prescriptions', prescriptionRouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

export default app;
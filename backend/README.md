# MediTrack - Backend API

Digital Medication History Platform Backend

## Project Structure

```
src/
├── config/
│   ├── db.js              - Database connection
│   └── config.js          - Environment configuration
├── models/
│   ├── user.model.js      - Patient model
│   ├── store.model.js     - Pharmacy model
│   ├── medicine.model.js  - Medicine inventory model
│   ├── purchase.model.js  - Order/Purchase model
│   ├── report.model.js    - Complaint/Report model
│   └── receipt.model.js   - Receipt model
├── controllers/
│   ├── auth.controller.js      - Authentication
│   ├── medicine.controller.js  - Medicine management
│   ├── purchase.controller.js  - Purchase/Order handling
│   ├── report.controller.js    - Report/Complaint handling
│   └── store.controller.js     - Store management
├── routes/
│   ├── auth.route.js      - Auth endpoints
│   ├── medicine.route.js  - Medicine endpoints
│   ├── purchase.route.js  - Purchase endpoints
│   ├── report.route.js    - Report endpoints
│   └── store.route.js     - Store endpoints
├── middleware/
│   ├── auth.middleware.js - Token verification
│   └── errorHandler.js    - Error handling
└── app.js                 - Express setup

server.js                  - Server entry point
package.json              - Dependencies
.env.example             - Environment variables template
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file from `.env.example`:
```bash
MONGO_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
# Optional: GEMINI_MODEL=gemini-3.6-flash
```

The store purchase page includes a handwritten prescription reader. It sends the
uploaded image to the backend, which calls Gemini and returns detected medicine
names. Keep `GEMINI_API_KEY` in the backend `.env`; do not expose it in the frontend.

### 3. Start Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/store` - Store/Pharmacy registration
- `POST /api/auth/login/patient` - Patient login
- `POST /api/auth/login/store` - Store login
- `POST /api/auth/logout` - Logout

### Medicines
- `GET /api/medicines/all` - Get all medicines
- `GET /api/medicines/:id` - Get medicine details
- `POST /api/medicines/add` - Add medicine (Store only)
- `PUT /api/medicines/:id` - Update medicine (Store only)
- `DELETE /api/medicines/:id` - Delete medicine (Store only)
- `GET /api/medicines/store/inventory` - Get store inventory
- `GET /api/medicines/store/low-stock` - Get low stock alerts
- `GET /api/medicines/store/expiring` - Get expiring medicines

### Purchases
- `POST /api/purchases/create` - Create purchase (Patient)
- `GET /api/purchases/patient/list` - Get patient purchases
- `GET /api/purchases/store/list` - Get store purchases
- `GET /api/purchases/store/stats` - Get purchase stats
- `GET /api/purchases/:id` - Get purchase details
- `GET /api/purchases/:purchaseId/receipt` - Get receipt

### Reports
- `POST /api/reports/create` - Create complaint (Patient)
- `GET /api/reports/patient/list` - Get patient reports
- `GET /api/reports/store/list` - Get store reports
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id/status` - Update report status (Store)
- `GET /api/reports/store/stats` - Get report statistics

### Stores
- `GET /api/stores/all` - Get all stores
- `GET /api/stores/profile` - Get store profile
- `PUT /api/stores/profile` - Update store profile
- `GET /api/stores/dashboard/stats` - Get dashboard stats
- `GET /api/stores/patients/list` - Get store patients
- `GET /api/stores/patients/:patientId` - Get patient profile

## Data Models

### User (Patient)
```javascript
{
  email, contact, fullname, password, dateOfBirth, gender,
  address, patientId, role, isActive, createdAt, updatedAt
}
```

### Store (Pharmacy)
```javascript
{
  storeName, storeEmail, storeContact, storeLicenseNumber, password,
  storeAddress, isActive, createdAt, updatedAt
}
```

### Medicine
```javascript
{
  storeId, name, genericName, manufacturer, composition, price,
  stock, unit, batchNumber, expiryDate, hsn, gst, description,
  requiresPrescription, isActive
}
```

### Purchase
```javascript
{
  purchaseId, patientId, storeId, medicines, subtotal, gstAmount,
  total, paymentMethod, status, notes
}
```

### Report
```javascript
{
  reportId, patientId, storeId, purchaseId, medicineId, medicineName,
  issueType, description, severity, status, resolution, refundAmount
}
```

## Authentication

All protected endpoints require a JWT token in cookies or Authorization header:
```
Authorization: Bearer <token>
```

Token payload includes userId and role for authorization checks.

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Database

Uses MongoDB with Mongoose ODM. Ensure MongoDB is running before starting the server.

# MediTrack API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Register Patient
**POST** `/auth/register/patient`

Request Body:
```json
{
  "fullname": "John Doe",
  "contact": "9876543210",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302001"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "patientId": "P-1234567890",
    "fullname": "John Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "role": "patient"
  }
}
```

### Register Store
**POST** `/auth/register/store`

Request Body:
```json
{
  "storeName": "MediCare Pharmacy",
  "storeEmail": "info@medicare.com",
  "storeContact": "9876543211",
  "storeLicenseNumber": "LIC123456",
  "password": "password123",
  "storeAddress": {
    "street": "456 Market St",
    "city": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302002"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Store registered successfully",
  "token": "jwt_token",
  "store": {
    "id": "store_id",
    "storeName": "MediCare Pharmacy",
    "storeEmail": "info@medicare.com",
    "storeContact": "9876543211",
    "role": "store"
  }
}
```

### Patient Login
**POST** `/auth/login/patient`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Alternative (using contact):
```json
{
  "contact": "9876543210",
  "password": "password123"
}
```

Response: Same as register response

### Store Login
**POST** `/auth/login/store`

Request Body:
```json
{
  "storeEmail": "info@medicare.com",
  "password": "password123"
}
```

### Logout
**POST** `/auth/logout`

Headers: `Authorization: Bearer <token>`

## Medicine Endpoints

### Add Medicine (Store)
**POST** `/medicines/add`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "name": "Aspirin",
  "genericName": "Acetylsalicylic acid",
  "manufacturer": "Bayer",
  "composition": "500mg",
  "price": 50,
  "stock": 100,
  "unit": "tablet",
  "batchNumber": "BATCH001",
  "expiryDate": "2025-12-31",
  "hsn": "30049099",
  "gst": 5,
  "description": "Pain reliever",
  "requiresPrescription": false
}
```

Response:
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "medicine": { ... }
}
```

### Get All Medicines (Public)
**GET** `/medicines/all?search=aspirin&maxPrice=100`

Response:
```json
{
  "success": true,
  "count": 10,
  "medicines": [ ... ]
}
```

### Get Store Inventory
**GET** `/medicines/store/inventory`

Headers: `Authorization: Bearer <token>` (Store only)

### Get Low Stock Medicines
**GET** `/medicines/store/low-stock`

Headers: `Authorization: Bearer <token>` (Store only)

Response includes medicines with stock ≤ 10 units

### Get Expiring Medicines
**GET** `/medicines/store/expiring`

Headers: `Authorization: Bearer <token>` (Store only)

Response includes medicines expiring within 30 days

### Update Medicine
**PUT** `/medicines/:id`

Headers: `Authorization: Bearer <token>` (Store only)

### Delete Medicine
**DELETE** `/medicines/:id`

Headers: `Authorization: Bearer <token>` (Store only)

## Purchase Endpoints

### Create Purchase (Patient)
**POST** `/purchases/create`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "medicines": [
    {
      "medicineId": "medicine_id",
      "quantity": 2
    },
    {
      "medicineId": "medicine_id_2",
      "quantity": 1
    }
  ],
  "storeId": "store_id",
  "paymentMethod": "cash",
  "notes": "delivery instructions"
}
```

Response:
```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "purchase": {
    "purchaseId": "ORD-1234567890",
    "patientId": "patient_id",
    "storeId": "store_id",
    "medicines": [ ... ],
    "subtotal": 1000,
    "gstAmount": 50,
    "total": 1050,
    "paymentMethod": "cash",
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Patient Purchases
**GET** `/purchases/patient/list`

Headers: `Authorization: Bearer <token>`

### Get Store Purchases
**GET** `/purchases/store/list`

Headers: `Authorization: Bearer <token>`

### Get Purchase Statistics
**GET** `/purchases/store/stats`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "stats": {
    "totalSales": 50000,
    "totalOrders": 150,
    "avgOrderValue": 333.33,
    "last30DaysSales": 12000
  }
}
```

### Get Receipt
**GET** `/purchases/:purchaseId/receipt`

Headers: `Authorization: Bearer <token>`

## Report Endpoints

### Create Report (Patient)
**POST** `/reports/create`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "purchaseId": "purchase_id",
  "medicineId": "medicine_id",
  "medicineName": "Aspirin",
  "issueType": "expired",
  "description": "Medicine expired on package",
  "severity": "high",
  "attachments": ["url1", "url2"]
}
```

Issue Types: `expired`, `damaged`, `wrong_medicine`, `quality_issue`, `quantity_mismatch`, `other`

Severity: `low`, `medium`, `high`

Response:
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "report": {
    "reportId": "RPT-1234567890",
    "status": "submitted",
    ...
  }
}
```

### Get Patient Reports
**GET** `/reports/patient/list`

Headers: `Authorization: Bearer <token>`

### Get Store Reports
**GET** `/reports/store/list`

Headers: `Authorization: Bearer <token>`

### Update Report Status (Store)
**PUT** `/reports/:id/status`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "status": "resolved",
  "resolution": "Medicine replaced",
  "refundAmount": 50
}
```

Status: `submitted`, `acknowledged`, `investigating`, `resolved`, `rejected`

### Get Report Statistics
**GET** `/reports/store/stats`

Headers: `Authorization: Bearer <token>`

Response includes counts by status, severity, and issue type

## Store Endpoints

### Get All Stores (Public)
**GET** `/stores/all?search=pharmacy&city=jaipur`

Response:
```json
{
  "success": true,
  "count": 5,
  "stores": [ ... ]
}
```

### Get Store Profile
**GET** `/stores/profile`

Headers: `Authorization: Bearer <token>`

### Update Store Profile
**PUT** `/stores/profile`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "storeName": "Updated Name",
  "storeContact": "9876543211",
  "storeAddress": { ... }
}
```

### Get Dashboard Statistics
**GET** `/stores/dashboard/stats`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "dashboard": {
    "totalRevenue": 100000,
    "totalOrders": 300,
    "totalPatients": 50,
    "todaysSales": 5000,
    "last7DaysSales": 35000,
    "avgOrderValue": 333.33
  }
}
```

### Get Store Patients
**GET** `/stores/patients/list`

Headers: `Authorization: Bearer <token>`

Includes statistics for each patient

### Get Patient Profile
**GET** `/stores/patients/:patientId`

Headers: `Authorization: Bearer <token>`

Includes full patient details and purchase history with this store

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["error1", "error2"]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Access denied. [Role] only"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

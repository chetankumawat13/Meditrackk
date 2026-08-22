# MediTrack API Testing Guide

## Using cURL

### Register Patient
```bash
curl -X POST http://localhost:3000/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Rajesh Kumar",
    "contact": "9876543210",
    "email": "rajesh@example.com",
    "password": "password123",
    "gender": "male",
    "address": {
      "city": "Jaipur",
      "state": "Rajasthan"
    }
  }'
```

### Register Store
```bash
curl -X POST http://localhost:3000/api/auth/register/store \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "HealthCare Pharmacy",
    "storeEmail": "store@healthcare.com",
    "storeContact": "9876543211",
    "storeLicenseNumber": "LIC12345",
    "password": "password123",
    "storeAddress": {
      "city": "Jaipur",
      "state": "Rajasthan"
    }
  }'
```

### Patient Login
```bash
curl -X POST http://localhost:3000/api/auth/login/patient \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "password123"
  }'
```

### Store Login
```bash
curl -X POST "http://localhost:3000/api/auth/login/store "\
  -H "Content-Type: application/json" \
  -d '{
    "storeEmail": "store@healthcare.com",
    "password": "password123"
  }'
```

### Add Medicine (Store)
```bash
curl -X POST http://localhost:3000/api/medicines/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STORE_TOKEN>" \
  -d '{
    "name": "Paracetamol",
    "genericName": "Acetaminophen",
    "manufacturer": "GSK",
    "composition": "500mg",
    "price": 45,
    "stock": 200,
    "unit": "tablet",
    "batchNumber": "BATCH123",
    "expiryDate": "2025-12-31",
    "gst": 5,
    "description": "Fever and pain relief"
  }'
```

### Get All Medicines
```bash
curl -X GET "http://localhost:3000/api/medicines/all?search=paracetamol" \
  -H "Content-Type: application/json"
```

### Get Store Inventory
```bash
curl -X GET http://localhost:3000/api/medicines/store/inventory \
  -H "Authorization: Bearer <STORE_TOKEN>"
```

### Create Purchase (Patient)
```bash
curl -X POST http://localhost:3000/api/purchases/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "medicines": [
      {
        "medicineId": "medicine_id_from_response",
        "quantity": 2
      }
    ],
    "storeId": "store_id_from_response",
    "paymentMethod": "cash"
  }'
```

### Get Patient Purchases
```bash
curl -X GET http://localhost:3000/api/purchases/patient/list \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

### Create Report (Patient)
```bash
curl -X POST http://localhost:3000/api/reports/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "purchaseId": "purchase_id",
    "medicineId": "medicine_id",
    "medicineName": "Paracetamol",
    "issueType": "expired",
    "description": "Medicine was expired",
    "severity": "high"
  }'
```

### Get Patient Reports
```bash
curl -X GET http://localhost:3000/api/reports/patient/list \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

### Get Store Reports
```bash
curl -X GET http://localhost:3000/api/reports/store/list \
  -H "Authorization: Bearer <STORE_TOKEN>"
```

### Update Report Status (Store)
```bash
curl -X PUT http://localhost:3000/api/reports/report_id/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STORE_TOKEN>" \
  -d '{
    "status": "resolved",
    "resolution": "Medicine replaced with new batch",
    "refundAmount": 45
  }'
```

### Get Store Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/stores/dashboard/stats \
  -H "Authorization: Bearer <STORE_TOKEN>"
```

### Get All Stores
```bash
curl -X GET "http://localhost:3000/api/stores/all?city=Jaipur" \
  -H "Content-Type: application/json"
```

## Using Postman

1. Create a new Collection "MediTrack"
2. Set up environment variables:
   - `base_url`: http://localhost:3000/api
   - `patient_token`: (leave empty, will be filled after login)
   - `store_token`: (leave empty, will be filled after login)
   - `store_id`: (store ID from registration)
   - `patient_id`: (patient ID from registration)

3. Create requests with pre-request scripts:
   - Requests should include Authorization header when needed
   - Use `{{base_url}}` for dynamic URL
   - Use `{{patient_token}}` or `{{store_token}}` for auth

## Testing Workflow

### 1. Patient Registration & Login
- Register a patient
- Login and copy the token
- Save token in environment

### 2. Store Registration & Login
- Register a store
- Login and copy the token
- Save token and store ID in environment

### 3. Medicine Management (Store)
- Add medicines to store inventory
- Get store inventory
- Update medicine price
- Check low stock and expiring medicines

### 4. Purchase Flow (Patient)
- Get all medicines
- Create a purchase
- Get patient purchases
- Get receipt

### 5. Report Flow (Patient & Store)
- Create a complaint report
- Get patient reports
- Get store reports (as store)
- Update report status
- Get statistics

## Notes

- Replace `<PATIENT_TOKEN>`, `<STORE_TOKEN>`, `medicine_id`, `store_id`, etc. with actual values
- All requests return JSON
- Status codes indicate success (200, 201) or errors (400, 401, 403, 404, 500)
- Tokens are valid for 7 days
- For protected endpoints, include Authorization header with Bearer token

## Common Issues

### 401 Unauthorized
- Token expired or invalid
- Re-login and get new token

### 403 Forbidden
- User role doesn't have permission for this endpoint
- Patient endpoints require patient token, store endpoints require store token

### 400 Bad Request
- Check required fields in request body
- Verify field types and formats

### 404 Not Found
- Resource doesn't exist
- Check if ID is correct

### 500 Server Error
- Check server logs
- Verify database connection
- Check request format

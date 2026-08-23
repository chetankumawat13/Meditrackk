# MediTrack

MediTrack is a digital medication and pharmacy management platform. It helps patients maintain a medication history and helps pharmacies manage medicines, sales, patients, prescriptions, and reports in one place.

## Product Features

### Patient Features

- Register and log in securely as a patient.
- Maintain a personal profile with contact, demographic, and address details.
- Browse medicines available from registered pharmacies.
- View medicine details, prices, availability, expiry dates, and prescription requirements.
- Purchase medicines from pharmacies and keep a digital purchase history.
- View purchase receipts and transaction details.
- Review prescription and medication information.
- Receive safety alerts for relevant medication and stock conditions.
- Report problems with medicines or purchases.
- Track submitted reports and their status.
- Share selected medical information with another MediTrack user using a temporary access code.
- Choose what a share code can reveal:
  - Contact details
  - Medicine and purchase history
  - Reports
  - All supported records
- Choose an expiry period for a share code.
- Copy, review, and revoke active share codes.
- Review access logs to see when shared records were accessed.
- Enter another user's share code and view the information they approved.

### Pharmacy / Store Features

- Register and log in securely as a pharmacy or store.
- Maintain a pharmacy profile with contact, address, and license information.
- Add, update, and deactivate medicines in the store inventory.
- Track medicine stock levels and identify low-stock medicines.
- Identify medicines that are approaching their expiry date.
- Search and browse available medicines.
- Create medicine sales for patients.
- Add medicines to a sale and calculate subtotal, GST, and total amounts.
- Support cash, card, UPI, and online payment methods.
- View sales history and purchase details.
- View store dashboard statistics.
- View patients associated with the store's sales.
- Review medicine-related patient reports and update report status.
- View report statistics.
- Read handwritten prescriptions through the backend prescription reader when the Gemini integration is configured.
- Enter a patient's temporary share code and view the contact, medicine history, or reports that the patient approved.

## Secure Sharing

MediTrack's sharing feature is designed for temporary, user-controlled access:

1. A patient selects the information to share and chooses an expiry period.
2. MediTrack generates a cryptographically random share code.
3. The database enforces code uniqueness and the server retries if a collision occurs.
4. The patient gives the code to a trusted MediTrack user, doctor, pharmacy, or hospital.
5. The recipient enters the code while logged in.
6. Only the approved information is returned.
7. Access is recorded in the patient's access log.
8. The patient can revoke an active code before it expires.

Shared information is read-only and is not copied into the recipient's own medication history.

## Main Application Areas

- Patient dashboard
- Medication history
- Prescriptions
- Safety alerts
- Reports
- Share records
- Patient profile
- Store dashboard
- Inventory
- Add medicine
- New sale
- Patients
- Sales history
- Store reports
- Get shared information

## Technology

- **Frontend:** React, React Router, Redux Toolkit, Axios, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Authentication:** JWT tokens using cookies or Authorization headers
- **Prescription reader:** Optional Gemini API integration

## Project Structure

```text
backend/     Express API, controllers, models, routes, and configuration
frontend/    React application, pages, layouts, state, and API clients
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` with the required configuration:

```env
MONGO_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=replace_with_a_secure_secret
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=optional_for_prescription_reader
```

The backend API is served under `/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses the Vite development server. Configure its API base URL according to the existing frontend environment and Vite configuration.

## API Areas

The backend provides API routes for:

- Authentication
- Users and profiles
- Stores
- Medicines and inventory
- Purchases and receipts
- Prescriptions
- Reports
- Dashboard statistics
- Share-code generation, redemption, revocation, and access logs

For endpoint details, see [backend/README.md](backend/README.md) and [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md).

## Important Configuration Notes

- MongoDB must be available before starting the backend.
- Keep `JWT_SECRET` and `GEMINI_API_KEY` private.
- Do not expose backend secrets in frontend environment variables.
- Prescription image analysis requires a configured Gemini API key.
- Share codes should be given only to trusted recipients because possession of an active code grants access to the approved records.

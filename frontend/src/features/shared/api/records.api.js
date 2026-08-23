import apiClient from '../../../shared/api/client.js';

export async function fetchMedicines({ inventory = false } = {}) {
	const response = await apiClient.get(inventory ? '/medicines/store/inventory' : '/medicines/all');
	return response.data;
}
export async function createMedicine(medicine) {
	const response = await apiClient.post('/medicines/add', medicine);
	return response.data;
}
export async function updateMedicineRequest(id, medicine) {
	const response = await apiClient.put(`/medicines/${id}`, medicine);
	return response.data;
}
export async function deleteMedicineRequest(id) {
	const response = await apiClient.delete(`/medicines/${id}`);
	return response.data;
}

export async function fetchStoreDashboard() {
	const response = await apiClient.get('/dashboard/store');
	return response.data;
}

export async function fetchStoreProfile() {
	const response = await apiClient.get('/stores/me');
	return response.data;
}

export async function updateStoreProfileRequest(profile) {
	const response = await apiClient.put('/stores/profile', profile);
	return response.data;
}

export async function fetchPatients(search = '') {
	const response = await apiClient.get('/stores/patients/list', {
		params: search ? { search } : undefined,
	});
	return response.data;
}

export function normalizePatient(patient) {
	return {
		...patient,
		id: idOf(patient._id || patient.id),
		name: patient.name || patient.fullname || '',
		mobile: String(patient.mobile || patient.contact || ''),
		patientId: patient.patientId || '',
	};
}
export async function createPatient() {
	throw new Error('The backend does not expose a create-patient endpoint.');
}

export async function fetchPurchases({ store = false } = {}) {
	const response = await apiClient.get(store ? '/purchases/store/list' : '/purchases/patient/list');
	return response.data;
}
export async function createPurchase(purchase, { byStore = false } = {}) {
	const response = await apiClient.post(byStore ? '/purchases/create-by-store' : '/purchases/create', purchase);
	return response.data;
}

export async function fetchPurchaseStats() {
	const response = await apiClient.get('/purchases/store/stats');
	return response.data;
}

export async function fetchReports({ store = false } = {}) {
	const response = await apiClient.get(store ? '/reports/store/list' : '/reports/patient/list');
	return response.data;
}
export async function createReport(report) {
	const response = await apiClient.post('/reports/create', report);
	return response.data;
}
export async function updateReportStatusRequest(id, status) {
	const response = await apiClient.put(`/reports/${id}/status`, { status });
	return response.data;
}

export async function fetchReportStats() {
	const response = await apiClient.get('/reports/store/stats');
	return response.data;
}

export async function fetchShareCodes() {
	const response = await apiClient.get('/share/active-codes');
	return response.data;
}
export async function createShareCode(patientID) {
	const response = await apiClient.post('/share/generate-code', { patientID });
	return response.data;
}
export async function revokeShareCodeRequest(patientID, code) {
	const response = await apiClient.put(`/share/revoke/${code}`, { patientID });
	return response.data;
}

export async function fetchAccessLogs() {
	const response = await apiClient.get('/share/access-logs');
	return response.data;
}

const idOf = (value) => value?._id || value?.id || value;

export function normalizeMedicine(medicine) {
	return {
		...medicine,
		id: idOf(medicine._id || medicine.id),
		generic: medicine.generic || medicine.genericName || '',
		category: medicine.category || '',
		expiry: medicine.expiry || medicine.expiryDate,
		prescriptionRequired: medicine.prescriptionRequired ?? medicine.requiresPrescription ?? false,
	};
}

export function normalizePurchase(purchase) {
	const items = (purchase.items || purchase.medicines || []).map((item) => ({
		...item,
		medicineID: idOf(item.medicineId || item.medicineID),
		discount: Number(item.discount || 0),
		price: Number(item.price || 0),
		quantity: Number(item.quantity || 0),
	}));
	const total = Number(purchase.total || 0);
	const subtotal = Number(purchase.subtotal ?? total);
	const discount = Number(purchase.discount || 0);
	const paid = Number(purchase.paid ?? (purchase.paymentMethod ? total : 0));

	return {
		...purchase,
		id: idOf(purchase._id || purchase.id) || purchase.purchaseId,
		patientID: idOf(purchase.patientId || purchase.patientID),
		storeID: idOf(purchase.storeId || purchase.storeID),
		date: purchase.date || purchase.createdAt,
		items,
		total,
		subtotal,
		discount,
		paid,
		due: Number(purchase.due ?? Math.max(0, total - paid)),
		paymentStatus: purchase.paymentStatus || purchase.status,
	};
}

export function normalizeReport(report) {
	return {
		...report,
		id: idOf(report._id || report.id) || report.reportId,
		patientID: idOf(report.patientId || report.patientID),
		receiptID: idOf(report.purchaseId || report.receiptID),
		medicine: report.medicine || report.medicineName,
		submitted: report.submitted || report.createdAt,
	};
}

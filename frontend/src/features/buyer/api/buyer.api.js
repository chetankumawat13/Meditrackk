export {
	fetchMedicines,
	fetchPurchases,
	createPurchase,
	fetchReports,
	createReport,
	fetchShareCodes,
	createShareCode,
	revokeShareCodeRequest,
	fetchAccessLogs,
} from '../../shared/api/records.api.js';

import apiClient from '../../../shared/api/client.js';

export async function fetchAIMedicationAlerts() {
	const response = await apiClient.get('/ai-medication/alerts');
	return response.data;
}

export async function triggerAIMedicationCheck(medicineId) {
	const response = await apiClient.post('/ai-medication/check-now', { medicineId });
	return response.data;
}

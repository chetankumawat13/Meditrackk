import apiClient from '../../../shared/api/client.js';

export async function readPrescription(file) {
  const image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });

  const response = await apiClient.post('/prescriptions/read', {
    image,
    mimeType: file.type,
  });
  return response.data;
}
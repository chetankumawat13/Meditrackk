import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines: [],
  patients: [],
  stores: [],
  purchases: [],
  reports: [],
  shareCodes: {},
  accessLogs: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    replaceData: (state, action) => {
      Object.assign(state, initialState, action.payload);
    },
    addMedicine: (state, action) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action) => {
      const idx = state.medicines.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.medicines[idx] = { ...state.medicines[idx], ...action.payload };
    },
    deleteMedicine: (state, action) => {
      state.medicines = state.medicines.filter((m) => m.id !== action.payload);
    },

    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },

    addPurchase: (state, action) => {
      const purchase = action.payload;
      state.purchases.push(purchase);
      purchase.items.forEach((item) => {
        const medicine = state.medicines.find((m) => m.id === item.medicineID);
        if (medicine) medicine.stock = Math.max(0, medicine.stock - item.quantity);
      });
    },

    addReport: (state, action) => {
      state.reports.push(action.payload);
    },
    updateReportStatus: (state, action) => {
      const report = state.reports.find((r) => r.id === action.payload.id);
      if (report) report.status = action.payload.status;
    },

    addShareCode: (state, action) => {
      const { patientID, code, created, expires } = action.payload;
      if (!state.shareCodes[patientID]) state.shareCodes[patientID] = [];
      state.shareCodes[patientID].push({ code, created, expires });
    },
    revokeShareCode: (state, action) => {
      const { patientID, code } = action.payload;
      if (state.shareCodes[patientID]) {
        state.shareCodes[patientID] = state.shareCodes[patientID].filter((c) => c.code !== code);
      }
    },
    addAccessLog: (state, action) => {
      const { patientID, accessedBy, timestamp } = action.payload;
      if (!state.accessLogs[patientID]) state.accessLogs[patientID] = [];
      state.accessLogs[patientID].push({ accessedBy, timestamp });
    },
  },
});

export const {
  replaceData,
  addMedicine, updateMedicine, deleteMedicine,
  addPatient, addPurchase,
  addReport, updateReportStatus,
  addShareCode, revokeShareCode, addAccessLog,
} = dataSlice.actions;

export default dataSlice.reducer;

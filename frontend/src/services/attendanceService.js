import api from './api';

export const attendanceService = {
  // RFID Scan Endpoint (Used by Web Simulator and ESP32 alike)
  async scanRfid(uid) {
    const response = await api.post('/rfid/scan', { uid });
    return response.data;
  },

  async getToday() {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  async getHistory(params = {}) {
    const response = await api.get('/attendance/history', { params });
    return response.data;
  },

  async getDashboardSummary() {
    const response = await api.get('/stats/summary');
    return response.data;
  },

  async createManual(data) {
    const response = await api.post('/attendance', data);
    return response.data;
  }
};

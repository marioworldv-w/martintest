import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_URL });

export const getStats = () => api.get("/stats");
export const getSellers = (params) => api.get("/sellers", { params });
export const deleteSeller = (id) => api.delete(`/sellers/${id}`);
export const getActivityLog = (params) => api.get("/activity-log", { params });
export const getLatestSession = () => api.get("/sessions/latest");
export const startWorker = (data) => api.post("/worker/start", data);
export const stopWorker = () => api.post("/worker/stop");
export const getWorkerStatus = () => api.get("/worker/status");
export const getPendingReviews = () => api.get("/review/pending");
export const confirmReview = (id) => api.post(`/review/${id}/confirm`);
export const skipReview = (id) => api.post(`/review/${id}/skip`);
export const getSettings = () => api.get("/settings");
export const updateSettings = (data) => api.put("/settings", data);
export const seedData = () => api.post("/seed");
export const clearData = () => api.post("/data/clear");
export const exportExcel = () => api.get("/export/excel", { responseType: "blob" });
export const exportCSV = () => api.get("/export/csv", { responseType: "blob" });

export default api;

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('taskflow_token');
  }
  return null;
};

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Tasks
export const taskApi = {
  getAll: (params = {}) =>
    axios.get(`${API_BASE}/api/tasks`, { ...authHeader(), params }),
  getOne: (id) => axios.get(`${API_BASE}/api/tasks/${id}`, authHeader()),
  create: (data) => axios.post(`${API_BASE}/api/tasks`, data, authHeader()),
  update: (id, data) => axios.put(`${API_BASE}/api/tasks/${id}`, data, authHeader()),
  updateStatus: (id, status) =>
    axios.patch(`${API_BASE}/api/tasks/${id}/status`, { status }, authHeader()),
  delete: (id) => axios.delete(`${API_BASE}/api/tasks/${id}`, authHeader()),
  addComment: (id, text) =>
    axios.post(`${API_BASE}/api/tasks/${id}/comments`, { text }, authHeader()),
  reorder: (tasks) =>
    axios.post(`${API_BASE}/api/tasks/reorder`, { tasks }, authHeader()),
  // Subtasks
  addSubtask: (id, text) =>
    axios.post(`${API_BASE}/api/tasks/${id}/subtasks`, { text }, authHeader()),
  toggleSubtask: (id, subtaskId) =>
    axios.patch(`${API_BASE}/api/tasks/${id}/subtasks/${subtaskId}/toggle`, {}, authHeader()),
  deleteSubtask: (id, subtaskId) =>
    axios.delete(`${API_BASE}/api/tasks/${id}/subtasks/${subtaskId}`, authHeader()),
  // Bulk
  bulk: (taskIds, action, value) =>
    axios.post(`${API_BASE}/api/tasks/bulk`, { taskIds, action, value }, authHeader()),
};

// Analytics
export const analyticsApi = {
  dashboard: () => axios.get(`${API_BASE}/api/analytics/dashboard`, authHeader()),
  weekly: () => axios.get(`${API_BASE}/api/analytics/weekly`, authHeader()),
  monthly: () => axios.get(`${API_BASE}/api/analytics/monthly`, authHeader()),
  activity: (params = {}) =>
    axios.get(`${API_BASE}/api/analytics/activity`, { ...authHeader(), params }),
};

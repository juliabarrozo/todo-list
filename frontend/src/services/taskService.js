import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getTasks = (status) => {
  const params = status && status !== 'all' ? { status } : {};
  return api.get('/tasks', { params });
};

export const createTask = (title) =>
  api.post('/tasks', { title });

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTasks(filter);
      setTasks(res.data);
    } catch {
      setError('Não foi possível carregar as tarefas. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title) => {
    const res = await api.createTask(title);
    if (filter === 'all' || filter === 'active') {
      setTasks((prev) => [res.data, ...prev]);
    }
  };

  const toggleTask = async (id, completed) => {
    const res = await api.updateTask(id, { completed: !completed });
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? res.data : t))
    );
    // Se há filtro ativo, recarrega para consistência
    if (filter !== 'all') fetchTasks();
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return {
    tasks,
    filter,
    setFilter,
    loading,
    error,
    addTask,
    toggleTask,
    removeTask,
    pendingCount,
    refetch: fetchTasks,
  };
}

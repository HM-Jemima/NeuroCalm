import { useState, useEffect } from 'react';

// Mock admin data
const MOCK_STATS = {
  total_users: '1,248',
  total_analyses: '8,439',
  avg_processing_time: '12.4s',
  model_accuracy: '95.3%',
};

const MOCK_USERS = [
  { id: '1', full_name: 'Dr. Sarah Admin', email: 'admin@neurocalm.com', role: 'admin', analyses_count: 342, is_active: true, created_at: '2025-06-15T10:00:00Z' },
  { id: '2', full_name: 'John Doe', email: 'user@neurocalm.com', role: 'user', analyses_count: 24, is_active: true, created_at: '2025-09-20T14:30:00Z' },
  { id: '3', full_name: 'Emily Chen', email: 'emily@research.edu', role: 'user', analyses_count: 156, is_active: true, created_at: '2025-07-03T09:15:00Z' },
  { id: '4', full_name: 'Dr. Michael Ross', email: 'mross@clinic.com', role: 'user', analyses_count: 89, is_active: true, created_at: '2025-08-12T16:45:00Z' },
  { id: '5', full_name: 'Alex Kumar', email: 'alex.k@lab.org', role: 'user', analyses_count: 12, is_active: false, created_at: '2025-11-01T11:20:00Z' },
];

const MOCK_MODEL = {
  model_type: 'Random Forest',
  version: 'v2.1.0',
  accuracy: '95.3%',
  features: '1,222',
  training_data: '10,450 samples',
  last_updated: 'Jan 15, 2026',
};

export function useAdmin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats(MOCK_STATS);
      setUsers(MOCK_USERS);
      setModelInfo(MOCK_MODEL);
      setLoading(false);
    }, 500);
  }, []);

  const deleteUser = async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    setUsers(users.filter((u) => u.id !== id));
  };

  return { stats, users, modelInfo, loading, error, deleteUser };
}

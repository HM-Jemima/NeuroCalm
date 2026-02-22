import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

// Mock users - no backend needed
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@neurocalm.com',
    password: 'admin123',
    full_name: 'Dr. Sarah Admin',
    role: 'admin',
    is_active: true,
    created_at: '2025-06-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'user@neurocalm.com',
    password: 'user123',
    full_name: 'John Doe',
    role: 'user',
    is_active: true,
    created_at: '2025-09-20T14:30:00Z',
  },
];

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, logout, setLoading } = useAuthStore();

  // On mount, restore session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('neurocalm_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw { response: { data: { detail: 'Invalid email or password.' } } };
    }

    // Don't store password in session
    const { password: _, ...userData } = found;
    localStorage.setItem('neurocalm_user', JSON.stringify(userData));
    localStorage.setItem('access_token', 'mock-token-' + found.id);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    await new Promise((r) => setTimeout(r, 500));

    // Check if email already taken
    if (MOCK_USERS.find((u) => u.email === formData.email)) {
      throw { response: { data: { detail: 'Email already registered.' } } };
    }

    const newUser = {
      id: String(Date.now()),
      email: formData.email,
      full_name: formData.full_name,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('neurocalm_user', JSON.stringify(newUser));
    localStorage.setItem('access_token', 'mock-token-' + newUser.id);
    setUser(newUser);
    return newUser;
  };

  const handleLogout = () => {
    localStorage.removeItem('neurocalm_user');
    logout();
  };

  return { user, isAuthenticated, isLoading, login, register, logout: handleLogout };
}

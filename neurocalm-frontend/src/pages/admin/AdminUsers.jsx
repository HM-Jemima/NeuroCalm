import { motion } from 'framer-motion';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, Search, UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import UsersTable from '../../components/admin/UsersTable';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import { useAdmin } from '../../hooks/useAdmin';

const adminNav = [
  { label: 'Dashboard', icon: Home, path: '/admin' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Analyses', icon: FileText, path: '/admin/analyses' },
  { label: 'ML Model', icon: Cpu, path: '/admin/model' },
  { label: 'Server', icon: Server, path: '/admin/server' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminUsers() {
  const { user, logout } = useAuthStore();
  const { users, createUser, deleteUser, error } = useAdmin();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true,
  });
  const showToast = useToastStore((state) => state.showToast);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resetForm = () => {
    setNewUser({
      full_name: '',
      email: '',
      password: '',
      role: 'user',
      is_active: true,
    });
    setFormError('');
  };

  const openAddUserModal = () => {
    resetForm();
    setIsAddUserOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserOpen(false);
    setIsSubmitting(false);
    setFormError('');
    if (searchParams.get('create') === '1') {
      setSearchParams({}, { replace: true });
    }
  };

  const handleFieldChange = (field, value) => {
    setNewUser((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (!newUser.full_name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setFormError('Full name, email, and password are required.');
      return;
    }

    if (newUser.password.trim().length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      await createUser({
        ...newUser,
        full_name: newUser.full_name.trim(),
        email: newUser.email.trim(),
        password: newUser.password.trim(),
      });
      showToast({
        title: 'User created',
        message: `${newUser.full_name.trim()} has been added successfully.`,
        variant: 'success',
      });
      closeAddUserModal();
      resetForm();
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = u.full_name || u.email || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });
  const shouldOpenCreateModal = searchParams.get('create') === '1';

  useEffect(() => {
    if (shouldOpenCreateModal) {
      openAddUserModal();
    }
  }, [shouldOpenCreateModal]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-bg-card/80 backdrop-blur-[20px] border-r border-border-color flex flex-col z-30">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <span className="font-display text-[20px] font-bold text-text-primary">NeuroCalm</span>
            <Badge variant="danger" className="ml-2 text-[9px] py-0.5 px-1.5">ADMIN</Badge>
          </div>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1">
          <p className="px-4 py-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
            Admin Panel
          </p>
          {adminNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-accent-blue/10 text-accent-blue border-l-[3px] border-accent-blue'
                  : 'text-text-secondary hover:bg-bg-glass hover:text-text-primary'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-accent-red/10 hover:text-accent-red transition-all duration-200 w-full mt-4"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="px-6 py-4 border-t border-border-color flex items-center gap-3">
          <Avatar name={user?.full_name || 'Admin'} size={38} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text-primary truncate">
              {user?.full_name || 'Admin'}
            </p>
            <p className="text-[11px] text-text-muted truncate">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">User Management</h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage platform users and their permissions
              </p>
            </div>
            <Button size="sm" onClick={openAddUserModal}>
              <UserPlus size={16} className="mr-2 inline" />
              Add User
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-2.5 bg-bg-glass border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-red">{error}</p>
          )}

          <Card hover={false}>
            <UsersTable users={filteredUsers} onDelete={deleteUser} />
          </Card>
        </motion.div>
      </main>

      <Modal isOpen={isAddUserOpen} onClose={closeAddUserModal} title="Add User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            value={newUser.full_name}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            placeholder="Enter full name"
          />

          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Enter email address"
          />

          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            placeholder="Set a password"
          />

          <div>
            <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-medium">
              Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['user', 'admin'].map((role) => {
                const active = newUser.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleFieldChange('role', role)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                        : 'border-border-color bg-bg-glass text-text-secondary hover:border-accent-blue/30 hover:text-text-primary'
                    }`}
                  >
                    {role === 'admin' ? 'Administrator' : 'User'}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border-color bg-bg-glass px-4 py-3 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={newUser.is_active}
              onChange={(e) => handleFieldChange('is_active', e.target.checked)}
              className="h-4 w-4 rounded accent-accent-blue"
            />
            Active account
          </label>

          {formError && (
            <p className="text-sm text-accent-red">{formError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeAddUserModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

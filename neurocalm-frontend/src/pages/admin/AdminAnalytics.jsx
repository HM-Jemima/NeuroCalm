import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut,
} from 'lucide-react';
import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import useAuthStore from '../../store/authStore';
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

export default function AdminAnalytics() {
  const { user, logout } = useAuthStore();
  const { analytics, fetchAnalytics, error } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics().catch(() => {});
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const distribution = analytics?.distribution || [];

  return (
    <div className="min-h-screen bg-bg-primary">
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

      <main className="ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary">Analytics</h1>
            <p className="text-sm text-text-secondary mt-1">
              Platform usage and analysis metrics
            </p>
          </div>

          {error && (
            <p className="text-sm text-accent-red">{error}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Card hover={false}>
              <p className="text-xs text-text-muted mb-1">This Week</p>
              <p className="text-2xl font-display font-bold text-text-primary">{analytics?.total_this_week ?? 0}</p>
            </Card>
            <Card hover={false}>
              <p className="text-xs text-text-muted mb-1">This Month</p>
              <p className="text-2xl font-display font-bold text-text-primary">{analytics?.total_this_month ?? 0}</p>
            </Card>
            <Card hover={false}>
              <p className="text-xs text-text-muted mb-1">Avg Stress Score</p>
              <p className="text-2xl font-display font-bold text-text-primary">{analytics?.avg_stress_score ?? 0}</p>
            </Card>
          </div>

          <Card hover={false}>
            <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
              Weekly Analysis Volume
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#f9fafb',
                    }}
                  />
                  <Bar dataKey="analyses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card hover={false}>
            <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
              Stress Score Distribution
            </h3>
            <div className="space-y-3">
              {distribution.map((item) => (
                <div key={item.range} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-text-secondary">{item.range}</span>
                  <div className="flex-1 h-2 bg-bg-glass rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                      style={{ width: `${Math.min(item.count * 5, 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-text-primary">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

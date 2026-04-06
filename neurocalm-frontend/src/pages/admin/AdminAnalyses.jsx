import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, Search, Download,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
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

const resultColors = {
  Stressed: 'text-accent-red bg-accent-red/10',
  Relaxed: 'text-accent-green bg-accent-green/10',
  Moderate: 'text-accent-yellow bg-accent-yellow/10',
};

export default function AdminAnalyses() {
  const { user, logout } = useAuthStore();
  const { analyses, fetchAnalyses, loading, error } = useAdmin();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnalyses().catch(() => {});
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = analyses.filter((analysis) => {
    const matchesSearch = analysis.user.toLowerCase().includes(search.toLowerCase())
      || analysis.file.toLowerCase().includes(search.toLowerCase())
      || analysis.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || analysis.result.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Analyses</h1>
              <p className="text-sm text-text-secondary mt-1">
                View and manage all analyses across the platform
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => fetchAnalyses().catch(() => {})}>
              <Download size={16} className="mr-2 inline" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, file, or ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-bg-glass border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'stressed', 'relaxed', 'moderate'].map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors
                    ${filter === value
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-text-muted hover:text-text-secondary'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-red">{error}</p>
          )}

          <Card hover={false}>
            {loading && analyses.length === 0 ? (
              <div className="py-10 text-center text-sm text-text-secondary">
                Loading analyses...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">User</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">File</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Result</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Confidence</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((analysis) => (
                      <tr key={analysis.id} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-text-muted font-mono">{analysis.id}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">{analysis.user}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary font-mono text-xs">{analysis.file}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${resultColors[analysis.result] || 'text-text-secondary bg-bg-glass'}`}>
                            {analysis.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{analysis.confidence}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{analysis.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, CheckCircle,
} from 'lucide-react';
import { useEffect } from 'react';
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

const levelColors = {
  INFO: 'text-accent-blue',
  WARN: 'text-accent-yellow',
  ERROR: 'text-accent-red',
};

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminServer() {
  const { user, logout } = useAuthStore();
  const { serverStatus, fetchServerStatus, error } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServerStatus().catch(() => {});
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-display font-bold text-text-primary">Server Status</h1>
            <p className="text-sm text-text-secondary mt-1">
              Infrastructure monitoring and system health
            </p>
          </motion.div>

          {error && (
            <motion.p variants={fadeUp} className="text-sm text-accent-red">
              {error}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            {(serverStatus?.resources || []).map((resource) => (
              <Card key={resource.label} hover={false}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                    <Server size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{resource.label}</p>
                    <p className="text-sm font-semibold text-text-primary">{resource.value}</p>
                  </div>
                </div>
                <div className="h-2 bg-bg-glass rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      resource.bar > 80 ? 'bg-accent-red' : resource.bar > 60 ? 'bg-accent-yellow' : 'bg-accent-blue'
                    }`}
                    style={{ width: `${resource.bar}%` }}
                  />
                </div>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Services
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Service</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Uptime</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Port</th>
                  </tr>
                </thead>
                <tbody>
                  {(serverStatus?.services || []).map((service) => (
                    <tr key={service.name} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-text-primary">{service.name}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${service.status === 'running' ? 'text-accent-green' : 'text-accent-red'}`}>
                          <CheckCircle size={12} />
                          {service.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">{service.uptime}</td>
                      <td className="py-3 px-4 text-sm text-text-muted font-mono">{service.port}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Recent Logs
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {(serverStatus?.logs || []).map((log, index) => (
                  <div key={`${log.time}-${index}`} className="flex gap-4 px-3 py-2 rounded-lg bg-bg-primary/50">
                    <span className="text-text-muted flex-shrink-0">{log.time}</span>
                    <span className={`flex-shrink-0 w-12 ${levelColors[log.level] || 'text-text-muted'}`}>{log.level}</span>
                    <span className="text-text-secondary">{log.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

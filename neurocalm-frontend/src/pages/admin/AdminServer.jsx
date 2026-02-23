import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, HardDrive, Wifi, Database, Shield,
  CheckCircle, AlertTriangle,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import useAuthStore from '../../store/authStore';

const adminNav = [
  { label: 'Dashboard', icon: Home, path: '/admin' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Analyses', icon: FileText, path: '/admin/analyses' },
  { label: 'ML Model', icon: Cpu, path: '/admin/model' },
  { label: 'Server', icon: Server, path: '/admin/server' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const serverStats = [
  { label: 'CPU Usage', value: '34%', icon: Cpu, color: 'bg-accent-blue/10 text-accent-blue', bar: 34 },
  { label: 'Memory', value: '6.2 / 16 GB', icon: HardDrive, color: 'bg-accent-purple/10 text-accent-purple', bar: 39 },
  { label: 'Disk Usage', value: '48.3 / 100 GB', icon: Database, color: 'bg-accent-cyan/10 text-accent-cyan', bar: 48 },
  { label: 'Network', value: '124 Mbps', icon: Wifi, color: 'bg-accent-green/10 text-accent-green', bar: 62 },
];

const services = [
  { name: 'API Server', status: 'running', uptime: '14d 6h 32m', port: 8000 },
  { name: 'ML Inference Engine', status: 'running', uptime: '14d 6h 32m', port: 8001 },
  { name: 'PostgreSQL Database', status: 'running', uptime: '30d 2h 15m', port: 5432 },
  { name: 'Redis Cache', status: 'running', uptime: '30d 2h 15m', port: 6379 },
  { name: 'Task Queue (Celery)', status: 'running', uptime: '14d 6h 30m', port: '-' },
  { name: 'File Storage (S3)', status: 'running', uptime: '99.99%', port: '-' },
];

const recentLogs = [
  { time: '14:32:05', level: 'INFO', message: 'Analysis A-1042 completed successfully (12.1s)' },
  { time: '14:31:52', level: 'INFO', message: 'File upload received: eeg_session_12.mat (2.4 MB)' },
  { time: '14:28:11', level: 'WARN', message: 'ML inference latency above threshold (15.2s > 15s)' },
  { time: '14:25:03', level: 'INFO', message: 'User login: admin@neurocalm.com' },
  { time: '14:20:45', level: 'INFO', message: 'Analysis A-1041 completed successfully (11.8s)' },
  { time: '14:15:22', level: 'INFO', message: 'Cache cleared: 142 expired entries removed' },
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-display font-bold text-text-primary">Server Status</h1>
            <p className="text-sm text-text-secondary mt-1">
              Infrastructure monitoring and system health
            </p>
          </motion.div>

          {/* Resource Usage */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            {serverStats.map((s) => (
              <Card key={s.label} hover={false}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                    <s.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{s.label}</p>
                    <p className="text-sm font-semibold text-text-primary">{s.value}</p>
                  </div>
                </div>
                <div className="h-2 bg-bg-glass rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.bar > 80 ? 'bg-accent-red' : s.bar > 60 ? 'bg-accent-yellow' : 'bg-accent-blue'
                    }`}
                    style={{ width: `${s.bar}%` }}
                  />
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Services */}
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
                  {services.map((svc) => (
                    <tr key={svc.name} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-text-primary">{svc.name}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-accent-green">
                          <CheckCircle size={12} />
                          {svc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">{svc.uptime}</td>
                      <td className="py-3 px-4 text-sm text-text-muted font-mono">{svc.port}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>

          {/* Recent Logs */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Recent Logs
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {recentLogs.map((log, i) => (
                  <div key={i} className="flex gap-4 px-3 py-2 rounded-lg bg-bg-primary/50">
                    <span className="text-text-muted flex-shrink-0">{log.time}</span>
                    <span className={`flex-shrink-0 w-12 ${levelColors[log.level]}`}>{log.level}</span>
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

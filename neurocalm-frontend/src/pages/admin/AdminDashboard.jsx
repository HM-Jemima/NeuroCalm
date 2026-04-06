import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, UserPlus, Download, RefreshCw, Shield,
} from 'lucide-react';
import { useEffect } from 'react';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatsCard from '../../components/dashboard/StatsCard';
import UploadZone from '../../components/dashboard/UploadZone';
import AnalysisResult from '../../components/dashboard/AnalysisResult';
import BandPowerChart from '../../components/dashboard/BandPowerChart';
import UsersTable from '../../components/admin/UsersTable';
import SystemStats from '../../components/admin/SystemStats';
import ActivityFeed from '../../components/admin/ActivityFeed';
import ModelInfo from '../../components/admin/ModelInfo';
import useAuthStore from '../../store/authStore';
import { useAdmin } from '../../hooks/useAdmin';
import { useAnalysis } from '../../hooks/useAnalysis';

const adminNav = [
  { label: 'Dashboard', icon: Home, path: '/admin' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Analyses', icon: FileText, path: '/admin/analyses' },
  { label: 'ML Model', icon: Cpu, path: '/admin/model' },
  { label: 'Server', icon: Server, path: '/admin/server' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const quickActions = [
  { icon: UserPlus, label: 'Add User', color: 'bg-accent-blue/10 text-accent-blue' },
  { icon: Download, label: 'Export Data', color: 'bg-accent-green/10 text-accent-green' },
  { icon: RefreshCw, label: 'Update Model', color: 'bg-accent-purple/10 text-accent-purple' },
  { icon: Shield, label: 'Security', color: 'bg-accent-yellow/10 text-accent-yellow' },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const { stats, users, modelInfo, serverStatus, deleteUser, fetchServerStatus, error } = useAdmin();
  const {
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    uploadAndAnalyze,
    clearAnalysis,
  } = useAnalysis();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAddUserFlow = () => {
    navigate('/admin/users?create=1');
  };

  useEffect(() => {
    fetchServerStatus().catch(() => {});
  }, [user?.id]);

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
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-display font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              System overview and management tools
            </p>
          </motion.div>

          {error && (
            <motion.p variants={fadeUp} className="text-sm text-accent-red">
              {error}
            </motion.p>
          )}

          {/* Stats Grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
            <StatsCard
              icon={Users}
              label="Total Users"
              value={stats?.total_users ?? '1,248'}
              change="+12%"
              iconBg="bg-accent-blue/10"
              iconColor="text-accent-blue"
            />
            <StatsCard
              icon={FileText}
              label="Total Analyses"
              value={stats?.total_analyses ?? '8,439'}
              change="+23%"
              iconBg="bg-accent-green/10"
              iconColor="text-accent-green"
            />
            <StatsCard
              icon={Cpu}
              label="Avg Processing"
              value={stats?.avg_processing_time ?? '12.4s'}
              change="-8%"
              iconBg="bg-accent-purple/10"
              iconColor="text-accent-purple"
            />
            <StatsCard
              icon={BarChart3}
              label="Model Accuracy"
              value={stats?.model_accuracy ?? '95.3%'}
              change="+2%"
              iconBg="bg-accent-cyan/10"
              iconColor="text-accent-cyan"
            />
          </motion.div>

          {/* Main Grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-[1fr_400px] gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Upload Zone */}
              <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-display text-text-primary">
                    Quick Analysis
                  </h3>
                  {currentAnalysis && (
                    <button
                      onClick={clearAnalysis}
                      className="text-sm text-accent-blue hover:underline"
                    >
                      New Upload
                    </button>
                  )}
                </div>
                <UploadZone
                  onAnalyze={uploadAndAnalyze}
                  isAnalyzing={isAnalyzing}
                  uploadProgress={uploadProgress}
                  resultId={currentAnalysis?.id}
                />
              </Card>

              {/* Analysis Result (shown after upload) */}
              {currentAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Card hover={false}>
                    <h3 className="text-sm font-semibold font-display text-text-primary mb-4">
                      Stress Detection
                    </h3>
                    <AnalysisResult result={currentAnalysis} />
                  </Card>
                  <Card hover={false}>
                    <h3 className="text-sm font-semibold font-display text-text-primary mb-4">
                      Band Power
                    </h3>
                    <BandPowerChart bandPowers={currentAnalysis.band_powers} />
                  </Card>
                </motion.div>
              )}

              <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-display text-text-primary">Users</h3>
                  <button
                    type="button"
                    onClick={openAddUserFlow}
                    className="text-sm text-accent-blue hover:underline flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    Add User
                  </button>
                </div>
                <UsersTable users={users} onDelete={deleteUser} />
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                  Activity Feed
                </h3>
                <ActivityFeed activities={serverStatus?.logs} />
              </Card>

              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                  System Status
                </h3>
                <SystemStats stats={serverStatus?.resources} />
              </Card>

              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                  ML Model Info
                </h3>
                <ModelInfo info={modelInfo} />
              </Card>

              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.label === 'Add User' ? openAddUserFlow : undefined}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border-color hover:border-accent-blue/30 transition-all`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                        <action.icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary">{action.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

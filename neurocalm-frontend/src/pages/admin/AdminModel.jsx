import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, RefreshCw, CheckCircle, Clock, Activity,
} from 'lucide-react';
import { useEffect } from 'react';
import appConfig from '../../config/appConfig';
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

const trainingHistory = [
  { version: 'v2.1.0', date: 'Jan 15, 2026', accuracy: '95.3%', samples: '10,450', status: 'active' },
  { version: 'v2.0.0', date: 'Dec 01, 2025', accuracy: '93.8%', samples: '8,200', status: 'archived' },
  { version: 'v1.5.0', date: 'Oct 10, 2025', accuracy: '91.2%', samples: '6,500', status: 'archived' },
  { version: 'v1.0.0', date: 'Aug 01, 2025', accuracy: '88.5%', samples: '4,000', status: 'archived' },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminModel() {
  const { user, logout } = useAuthStore();
  const { modelInfo, stats, serverStatus, fetchServerStatus, error } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServerStatus().catch(() => {});
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const apiService = serverStatus?.services?.find((service) => service.name === 'API Server');
  const modelMetrics = [
    { label: 'Accuracy', value: modelInfo?.accuracy || '95.3%', icon: CheckCircle, color: 'bg-accent-green/10 text-accent-green' },
    { label: 'Avg Inference', value: stats?.avg_processing_time || '12.4s', icon: Clock, color: 'bg-accent-blue/10 text-accent-blue' },
    { label: 'Total Predictions', value: stats?.total_analyses || '0', icon: Activity, color: 'bg-accent-purple/10 text-accent-purple' },
    { label: 'Uptime', value: apiService?.uptime || 'N/A', icon: CheckCircle, color: 'bg-accent-cyan/10 text-accent-cyan' },
  ];
  const featureColumns = Array.isArray(modelInfo?.feature_cols) ? modelInfo.feature_cols : [];
  const evaluationSubjects = Array.isArray(modelInfo?.evaluation_subjects) ? modelInfo.evaluation_subjects : [];
  const liveEvaluationItems = [
    { label: 'F1 Score', value: modelInfo?.f1_score || 'N/A' },
    { label: 'Kappa', value: modelInfo?.kappa || 'N/A' },
    { label: 'Timesteps', value: modelInfo?.timesteps || 'N/A' },
    { label: 'Channels', value: modelInfo?.n_channels || 'N/A' },
    { label: 'Classes', value: modelInfo?.n_classes || 'N/A' },
    { label: 'Evaluation Timestamp', value: modelInfo?.evaluation_timestamp || 'N/A' },
  ];

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
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">ML Model</h1>
              <p className="text-sm text-text-secondary mt-1">
                Model configuration, performance metrics, and training history
              </p>
            </div>
            <Button size="sm">
              <RefreshCw size={16} className="mr-2 inline" />
              Retrain Model
            </Button>
          </motion.div>

          {error && (
            <motion.p variants={fadeUp} className="text-sm text-accent-red">
              {error}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
            {modelMetrics.map((metric) => (
              <Card key={metric.label} hover={false}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center`}>
                    <metric.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{metric.label}</p>
                    <p className="text-lg font-display font-bold text-text-primary">{metric.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Active Model
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Model Type', value: modelInfo?.model_type || 'Random Forest' },
                  { label: 'Version', value: modelInfo?.version || 'v2.1.0' },
                  { label: 'Features Used', value: modelInfo?.features || '1,222' },
                  { label: 'Training Samples', value: modelInfo?.training_data || '10,450 samples' },
                  { label: 'Last Updated', value: modelInfo?.last_updated || 'Jan 15, 2026' },
                  { label: 'Accuracy', value: modelInfo?.accuracy || '95.3%' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-text-muted mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {appConfig.useMockDataEnabled ? (
            <>
              <motion.div variants={fadeUp}>
                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                    Top Feature Importance
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Beta Band Power (13-30 Hz)', importance: 92 },
                      { name: 'Alpha Band Power (8-13 Hz)', importance: 87 },
                      { name: 'Alpha/Beta Ratio', importance: 78 },
                      { name: 'Theta Band Power (4-8 Hz)', importance: 65 },
                      { name: 'Gamma Band Power (30-100 Hz)', importance: 52 },
                      { name: 'Delta Band Power (0.5-4 Hz)', importance: 41 },
                    ].map((feature) => (
                      <div key={feature.name} className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary w-56 flex-shrink-0">{feature.name}</span>
                        <div className="flex-1 h-2 bg-bg-glass rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                            style={{ width: `${feature.importance}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted w-10 text-right">{feature.importance}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                    Training History
                  </h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-color">
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Version</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Accuracy</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Samples</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingHistory.map((trainingRun) => (
                        <tr key={trainingRun.version} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-text-primary font-mono">{trainingRun.version}</td>
                          <td className="py-3 px-4 text-sm text-text-secondary">{trainingRun.date}</td>
                          <td className="py-3 px-4 text-sm text-text-primary font-medium">{trainingRun.accuracy}</td>
                          <td className="py-3 px-4 text-sm text-text-secondary">{trainingRun.samples}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              trainingRun.status === 'active'
                                ? 'bg-accent-green/10 text-accent-green'
                                : 'bg-bg-glass text-text-muted'
                            }`}>
                              {trainingRun.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={fadeUp}>
                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                    Feature Schema
                  </h3>
                  {featureColumns.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {featureColumns.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">
                      Feature schema is not available from the backend yet.
                    </p>
                  )}
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                    Latest Evaluation Snapshot
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {liveEvaluationItems.map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-text-muted mb-1">{item.label}</p>
                        <p className="text-sm font-medium text-text-primary">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-display text-text-primary">
                      Subject Evaluation Scores
                    </h3>
                    <span className="text-xs text-text-muted">
                      {evaluationSubjects.length} subjects shown
                    </span>
                  </div>
                  {evaluationSubjects.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-color">
                          <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Subject</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Accuracy</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">F1 Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluationSubjects.map((subject) => (
                          <tr key={subject.subject} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-text-primary">{subject.subject}</td>
                            <td className="py-3 px-4 text-sm text-text-secondary">{subject.accuracy || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm text-text-secondary">{subject.f1 || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-text-secondary">
                      Evaluation subject scores are not available from the backend yet.
                    </p>
                  )}
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, Search, Download, Filter,
} from 'lucide-react';
import { useState } from 'react';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
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

const mockAnalyses = [
  // Latest first
  { id: 'A-1052', user: 'Dr. Sarah Admin', file: 'admin_review_batch_01.mat',   result: 'Moderate',  confidence: '93.0%', date: '2026-02-23', status: 'completed' },
  { id: 'A-1051', user: 'John Doe',        file: 'eeg_recording_001.mat',       result: 'Relaxed',   confidence: '92.0%', date: '2026-02-23', status: 'completed' },
  { id: 'A-1050', user: 'Emily Chen',      file: 'session_morning.edf',         result: 'Stressed',  confidence: '87.0%', date: '2026-02-23', status: 'completed' },
  { id: 'A-1049', user: 'Dr. Sarah Admin', file: 'clinical_trial_eeg_005.edf',  result: 'Relaxed',   confidence: '90.0%', date: '2026-02-22', status: 'completed' },
  { id: 'A-1048', user: 'John Doe',        file: 'morning_session_feb22.edf',   result: 'Relaxed',   confidence: '89.0%', date: '2026-02-22', status: 'completed' },
  { id: 'A-1047', user: 'Dr. Michael Ross', file: 'post_meditation.mat',        result: 'Relaxed',   confidence: '95.0%', date: '2026-02-22', status: 'completed' },
  { id: 'A-1046', user: 'John Doe',        file: 'baseline_test.csv',           result: 'Moderate',  confidence: '91.0%', date: '2026-02-21', status: 'completed' },
  { id: 'A-1045', user: 'Emily Chen',      file: 'relaxation_study.mat',        result: 'Relaxed',   confidence: '94.0%', date: '2026-02-21', status: 'completed' },
  { id: 'A-1044', user: 'Alex Kumar',      file: 'work_stress_sample.edf',      result: 'Stressed',  confidence: '88.0%', date: '2026-02-21', status: 'completed' },
  { id: 'A-1043', user: 'Dr. Sarah Admin', file: 'validation_set_alpha.mat',    result: 'Stressed',  confidence: '88.0%', date: '2026-02-20', status: 'completed' },
  { id: 'A-1042', user: 'John Doe',        file: 'post_workout_scan.mat',       result: 'Relaxed',   confidence: '95.0%', date: '2026-02-20', status: 'completed' },
  { id: 'A-1041', user: 'Emily Chen',      file: 'focus_task_experiment.csv',   result: 'Moderate',  confidence: '90.0%', date: '2026-02-19', status: 'completed' },
  { id: 'A-1040', user: 'Dr. Michael Ross', file: 'patient_eeg_014.edf',       result: 'Stressed',  confidence: '92.0%', date: '2026-02-20', status: 'completed' },
  { id: 'A-1039', user: 'Dr. Sarah Admin', file: 'model_benchmark_v2.csv',     result: 'Relaxed',   confidence: '96.0%', date: '2026-02-18', status: 'completed' },
  { id: 'A-1038', user: 'John Doe',        file: 'pre_exam_reading.csv',        result: 'Stressed',  confidence: '86.0%', date: '2026-02-18', status: 'completed' },
  { id: 'A-1037', user: 'Alex Kumar',      file: 'lab_recording_trial_07.csv',  result: 'Moderate',  confidence: '91.0%', date: '2026-02-18', status: 'completed' },
  { id: 'A-1036', user: 'Emily Chen',      file: 'meditation_pre_post.edf',     result: 'Relaxed',   confidence: '96.0%', date: '2026-02-17', status: 'completed' },
  { id: 'A-1035', user: 'Dr. Michael Ross', file: 'sleep_onset_eeg.edf',       result: 'Relaxed',   confidence: '93.0%', date: '2026-02-17', status: 'completed' },
  { id: 'A-1034', user: 'John Doe',        file: 'evening_relaxation.edf',      result: 'Relaxed',   confidence: '93.0%', date: '2026-02-16', status: 'completed' },
  { id: 'A-1033', user: 'Dr. Sarah Admin', file: 'patient_followup_009.edf',   result: 'Stressed',  confidence: '91.0%', date: '2026-02-15', status: 'completed' },
  { id: 'A-1032', user: 'Emily Chen',      file: 'study_group_control.mat',     result: 'Moderate',  confidence: '88.0%', date: '2026-02-14', status: 'completed' },
  { id: 'A-1031', user: 'John Doe',        file: 'monday_commute_eeg.mat',      result: 'Moderate',  confidence: '87.0%', date: '2026-02-13', status: 'completed' },
  { id: 'A-1030', user: 'Dr. Michael Ross', file: 'clinical_assessment_021.mat', result: 'Stressed', confidence: '89.0%', date: '2026-02-13', status: 'completed' },
  { id: 'A-1029', user: 'Alex Kumar',      file: 'baseline_resting_state.mat',  result: 'Relaxed',   confidence: '93.0%', date: '2026-02-12', status: 'completed' },
  { id: 'A-1028', user: 'Dr. Sarah Admin', file: 'research_pilot_cohort_a.mat', result: 'Relaxed',  confidence: '94.0%', date: '2026-02-11', status: 'completed' },
  { id: 'A-1027', user: 'John Doe',        file: 'sleep_study_night_03.edf',    result: 'Relaxed',   confidence: '94.0%', date: '2026-02-09', status: 'completed' },
];

const resultColors = {
  Stressed: 'text-accent-red bg-accent-red/10',
  Relaxed: 'text-accent-green bg-accent-green/10',
  Moderate: 'text-accent-yellow bg-accent-yellow/10',
};

export default function AdminAnalyses() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = mockAnalyses.filter((a) => {
    const matchesSearch = a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.file.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.result.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-2xl font-display font-bold text-text-primary">Analyses</h1>
              <p className="text-sm text-text-secondary mt-1">
                View and manage all EEG analyses across the platform
              </p>
            </div>
            <Button size="sm" variant="ghost">
              <Download size={16} className="mr-2 inline" />
              Export All
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
              {['all', 'stressed', 'relaxed', 'moderate'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors
                    ${filter === f
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-text-muted hover:text-text-secondary'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Card hover={false}>
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
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-text-muted font-mono">{a.id}</td>
                      <td className="py-3 px-4 text-sm text-text-primary">{a.user}</td>
                      <td className="py-3 px-4 text-sm text-text-secondary font-mono text-xs">{a.file}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${resultColors[a.result]}`}>
                          {a.result}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">{a.confidence}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{a.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

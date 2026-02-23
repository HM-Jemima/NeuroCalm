import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, Home, BarChart3, Users, FileText, Cpu, Server,
  Settings, LogOut, Save, Bell, Shield, Globe, Database,
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

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-accent-blue' : 'bg-bg-glass border border-border-color'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export default function AdminSettings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'NeuroCalm',
    siteUrl: 'https://neurocalm.io',
    maxUploadSize: '50',
    allowedFormats: '.mat, .edf, .csv',
    enableRegistration: true,
    requireEmailVerification: false,
    enableMaintenanceMode: false,
    emailNotifications: true,
    slackAlerts: false,
    autoBackup: true,
    retentionDays: '90',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Settings</h1>
              <p className="text-sm text-text-secondary mt-1">
                Platform configuration and preferences
              </p>
            </div>
            <Button size="sm" onClick={handleSave} variant={saved ? 'success' : 'primary'}>
              {saved ? (
                <>Saved!</>
              ) : (
                <>
                  <Save size={16} className="mr-2 inline" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>

          {/* General */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                  <Globe size={18} className="text-accent-blue" />
                </div>
                <h3 className="text-lg font-semibold font-display text-text-primary">General</h3>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Site Name</label>
                    <input
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Site URL</label>
                    <input
                      value={settings.siteUrl}
                      onChange={(e) => updateSetting('siteUrl', e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Max Upload Size (MB)</label>
                    <input
                      value={settings.maxUploadSize}
                      onChange={(e) => updateSetting('maxUploadSize', e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Allowed File Formats</label>
                    <input
                      value={settings.allowedFormats}
                      onChange={(e) => updateSetting('allowedFormats', e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Shield size={18} className="text-accent-purple" />
                </div>
                <h3 className="text-lg font-semibold font-display text-text-primary">Security & Access</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'enableRegistration', label: 'Enable User Registration', desc: 'Allow new users to create accounts' },
                  { key: 'requireEmailVerification', label: 'Require Email Verification', desc: 'Users must verify email before accessing the platform' },
                  { key: 'enableMaintenanceMode', label: 'Maintenance Mode', desc: 'Disable access for non-admin users' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border-color/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={settings[item.key]}
                      onToggle={() => updateSetting(item.key, !settings[item.key])}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                  <Bell size={18} className="text-accent-cyan" />
                </div>
                <h3 className="text-lg font-semibold font-display text-text-primary">Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive admin alerts via email' },
                  { key: 'slackAlerts', label: 'Slack Alerts', desc: 'Send critical alerts to Slack channel' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border-color/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={settings[item.key]}
                      onToggle={() => updateSetting(item.key, !settings[item.key])}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Data */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
                  <Database size={18} className="text-accent-green" />
                </div>
                <h3 className="text-lg font-semibold font-display text-text-primary">Data & Storage</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border-color/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Automatic Backups</p>
                    <p className="text-xs text-text-muted mt-0.5">Run daily database backups</p>
                  </div>
                  <Toggle
                    enabled={settings.autoBackup}
                    onToggle={() => updateSetting('autoBackup', !settings.autoBackup)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Data Retention (days)</label>
                  <input
                    value={settings.retentionDays}
                    onChange={(e) => updateSetting('retentionDays', e.target.value)}
                    className="w-full max-w-xs px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                  />
                  <p className="text-xs text-text-muted mt-1">Analysis data older than this will be archived</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

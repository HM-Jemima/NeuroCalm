import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Shield, Save } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import useAuthStore from '../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <main className="ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary mt-1">Manage your account preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-bg-glass hover:text-text-primary'
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card hover={false} className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <Avatar name={user?.full_name || 'User'} size={64} className="rounded-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {user?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-text-secondary">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="space-y-5">
                <Input
                  label="Full Name"
                  icon={User}
                  defaultValue={user?.full_name || ''}
                  placeholder="Your full name"
                />
                <Input
                  label="Email"
                  icon={Mail}
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="Your email"
                />
                <Button>
                  <Save size={16} className="mr-2 inline" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card hover={false} className="max-w-2xl">
              <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                Change Password
              </h3>
              <div className="space-y-5">
                <Input
                  label="Current Password"
                  icon={Lock}
                  type="password"
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  icon={Lock}
                  type="password"
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm New Password"
                  icon={Lock}
                  type="password"
                  placeholder="Confirm new password"
                />
                <Button>Update Password</Button>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card hover={false} className="max-w-2xl">
              <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications', desc: 'Receive analysis results via email' },
                  { label: 'Analysis complete', desc: 'Get notified when analysis is done' },
                  { label: 'Weekly summary', desc: 'Weekly overview of your stress patterns' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border-color/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-6 bg-bg-glass rounded-full peer peer-checked:bg-accent-blue transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}

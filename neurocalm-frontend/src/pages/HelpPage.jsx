import { motion } from 'framer-motion';
import {
  Brain, Home, Upload, History, BarChart3, Settings,
  HelpCircle, LogOut, BookOpen, MessageSquare, FileText,
  Mail, ExternalLink, ChevronRight,
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import useAuthStore from '../store/authStore';

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'New Analysis', icon: Upload, path: '/dashboard/upload' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
];

const accountItems = [
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Help', icon: HelpCircle, path: '/help' },
];

const guides = [
  {
    icon: Upload,
    title: 'Uploading EEG Files',
    desc: 'Learn how to upload .mat, .edf, or .csv files for analysis. Drag and drop or click to browse.',
    color: 'bg-accent-blue/10 text-accent-blue',
  },
  {
    icon: Brain,
    title: 'Understanding Results',
    desc: 'Your analysis shows a stress score, confidence level, and detailed band power breakdown across five frequency bands.',
    color: 'bg-accent-purple/10 text-accent-purple',
  },
  {
    icon: BarChart3,
    title: 'Reading Reports',
    desc: 'Reports summarize your analyses over time. Export as PDF for your records or JSON for further processing.',
    color: 'bg-accent-cyan/10 text-accent-cyan',
  },
  {
    icon: History,
    title: 'Analysis History',
    desc: 'All your past analyses are saved. Search, filter, and revisit previous results anytime.',
    color: 'bg-accent-green/10 text-accent-green',
  },
];

const faq = [
  {
    q: 'What file formats are supported?',
    a: 'NeuroCalm supports .mat (MATLAB), .edf (European Data Format), and .csv files. Ensure your file contains valid EEG channel data.',
  },
  {
    q: 'How long does analysis take?',
    a: 'Most analyses complete in under 30 seconds. Processing time depends on file size and the number of channels.',
  },
  {
    q: 'What do the stress levels mean?',
    a: 'Relaxed (score < 40): Low stress indicators. Moderate (40–65): Some stress markers present. Stressed (> 65): Significant stress patterns detected.',
  },
  {
    q: 'Can I delete my analysis history?',
    a: 'Yes. Go to History, find the analysis you want to remove, and click the delete button. This action cannot be undone.',
  },
  {
    q: 'Is my data private?',
    a: 'All data is encrypted in transit and at rest. We never share your EEG data with third parties.',
  },
  {
    q: 'How do I export reports?',
    a: 'Navigate to the Reports page and click the download button on any report. Choose between PDF and JSON formats.',
  },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function HelpPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <NavLink
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          ${isActive
            ? 'bg-accent-blue/10 text-accent-blue border-l-[3px] border-accent-blue'
            : 'text-text-secondary hover:bg-bg-glass hover:text-text-primary'
          }`}
      >
        <item.icon size={18} />
        {item.label}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-bg-card/80 backdrop-blur-[20px] border-r border-border-color flex flex-col z-30">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <span className="font-display text-[22px] font-bold text-text-primary">
            NeuroCalm
          </span>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1">
          <p className="px-4 py-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
            Menu
          </p>
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          <p className="px-4 pt-6 pb-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
            Account
          </p>
          {accountItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              text-text-secondary hover:bg-accent-red/10 hover:text-accent-red transition-all duration-200 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="px-6 py-4 border-t border-border-color flex items-center gap-3">
          <Avatar name={user?.full_name || 'User'} size={38} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text-primary truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[11px] text-text-muted truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] p-8">
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-display font-bold text-text-primary">Help Center</h1>
            <p className="text-sm text-text-secondary mt-1">
              Guides, FAQs, and support resources
            </p>
          </motion.div>

          {/* Quick Guides */}
          <motion.div variants={fadeUp}>
            <h2 className="text-lg font-semibold font-display text-text-primary mb-4">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {guides.map((guide) => (
                <Card key={guide.title} className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${guide.color} flex items-center justify-center flex-shrink-0`}>
                      <guide.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold font-display text-text-primary mb-1">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{guide.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div variants={fadeUp}>
            <h2 className="text-lg font-semibold font-display text-text-primary mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faq.map((item) => (
                <Card key={item.q}>
                  <h3 className="text-sm font-semibold font-display text-text-primary mb-1.5">
                    {item.q}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.a}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div variants={fadeUp}>
            <Card className="border-accent-blue/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={22} className="text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-base font-semibold font-display text-text-primary mb-1">
                    Still need help?
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Reach out to our support team and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:support@neurocalm.io"
                    className="inline-flex items-center gap-2 text-sm text-accent-blue hover:underline"
                  >
                    <Mail size={14} />
                    support@neurocalm.io
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

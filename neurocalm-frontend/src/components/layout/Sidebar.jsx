import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, Home, Upload, History, BarChart3,
  Settings, HelpCircle, LogOut,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import useAuthStore from '../../store/authStore';

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

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const location = useLocation();

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
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-bg-card/80 backdrop-blur-[20px] border-r border-border-color flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
          <Brain size={22} className="text-white" />
        </div>
        <span className="font-display text-[22px] font-bold text-text-primary">
          NeuroCalm
        </span>
      </div>

      {/* Menu Section */}
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

      {/* User Profile */}
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
  );
}

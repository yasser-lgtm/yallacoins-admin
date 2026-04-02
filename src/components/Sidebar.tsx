import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ListTodo,
  DollarSign,
  Globe,
  AppWindow,
  FileText,
  Users,
  LogBook,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['super_admin', 'operations_admin', 'finance_admin', 'rate_manager', 'support_agent', 'auditor'] },
  { label: 'Requests', path: '/requests', icon: <ListTodo size={20} />, roles: ['super_admin', 'operations_admin', 'finance_admin', 'support_agent', 'auditor'] },
  { label: 'Rates', path: '/rates', icon: <DollarSign size={20} />, roles: ['super_admin', 'rate_manager'] },
  { label: 'Countries & Methods', path: '/countries', icon: <Globe size={20} />, roles: ['super_admin', 'rate_manager'] },
  { label: 'Apps', path: '/apps', icon: <AppWindow size={20} />, roles: ['super_admin', 'rate_manager'] },
  { label: 'Content', path: '/content', icon: <FileText size={20} />, roles: ['super_admin'] },
  { label: 'Users & Roles', path: '/users', icon: <Users size={20} />, roles: ['super_admin'] },
  { label: 'Audit Log', path: '/audit', icon: <LogBook size={20} />, roles: ['super_admin', 'auditor'] },
  { label: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, roles: ['super_admin', 'operations_admin', 'finance_admin', 'auditor'] },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['super_admin'] },
];

export const Sidebar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const visibleItems = navItems.filter(item => 
    user && hasPermission(item.roles)
  );

  return (
    <div className="w-64 bg-[#012D90] text-white flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-[#0A1F5C]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F0E68F] rounded-lg flex items-center justify-center">
            <span className="text-[#012D90] font-bold text-lg">YC</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">YallaCoins</h1>
            <p className="text-xs text-gray-300">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {visibleItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={`w-full px-6 py-3 flex items-center gap-3 text-left transition-colors duration-200 ${
              location === item.path
                ? 'bg-[#0A1F5C] border-r-4 border-[#F0E68F]'
                : 'hover:bg-[#0A1F5C] text-gray-200'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-[#0A1F5C] p-4">
        <div className="mb-4 px-2">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role.replace('_', ' ')}</p>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

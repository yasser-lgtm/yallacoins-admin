import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Settings, User } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Left Section - Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">YallaCoins Admin</h1>
        <p className="text-sm text-gray-600">Operations Dashboard</p>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 bg-[#012D90] text-white rounded-full flex items-center justify-center font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Music, Calendar, Users } from 'lucide-react';
import OneChurchLogo from '../common/OneChurchLogo';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: 'profiles', label: 'Profiles', icon: Users },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'lineup', label: 'Create Lineup', icon: Music, adminOnly: true },
    { id: 'schedule', label: 'View Schedule', icon: Calendar },
    { id: 'setlist', label: 'Setlist', icon: Music },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.adminOnly || currentUser?.userRole === 'Admin'
  );

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <OneChurchLogo className="text-white" size="md" />
              <h1 className="text-2xl font-bold text-white">One Church</h1>
            </div>
            <span className="text-gray-300 text-sm">Worship Scheduler</span>
          </div>

          <nav className="hidden md:flex space-x-1">
            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white bg-opacity-15 text-white shadow-lg border border-white border-opacity-20'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="h-4 w-4" />
              <span className="font-medium">{currentUser?.name}</span>
              <span className="text-xs bg-white bg-opacity-15 px-2 py-1 rounded-full border border-white border-opacity-20">
                {currentUser?.userRole}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white bg-opacity-15 text-white border border-white border-opacity-20'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRFIDStore } from '../../store/rfidStore';
import { format } from 'date-fns';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { alerts } = useRFIDStore();
  
  const unreadAlerts = alerts.filter(alert => !alert.resolved).length;
  
  return (
    <header className="bg-white border-b border-ajinomoto-gray-200 shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-ajinomoto-gray-500 hover:text-ajinomoto-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ajinomoto-red md:hidden"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>
            
            <div className="ml-4 flex lg:ml-0">
              <img
                src="https://www.ajinomoto.co.id/template/ajinomoto/logo/aji-logo-new2.svg"
                alt="Ajinomoto Logo"
                className="h-8"
              />
              <span className="ml-3 text-xl font-semibold text-ajinomoto-red hidden md:block">WMS RFID</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-ajinomoto-gray-500 mr-4 hidden md:block">
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </div>
            
            <div className="relative ml-4">
              <button
                type="button"
                className="flex rounded-full bg-white text-ajinomoto-gray-600 focus:outline-none focus:ring-2 focus:ring-ajinomoto-red"
              >
                <span className="relative">
                  <Bell size={22} />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ajinomoto-red text-xs text-white">
                      {unreadAlerts > 9 ? '9+' : unreadAlerts}
                    </span>
                  )}
                </span>
              </button>
            </div>
            
            <div className="relative ml-4">
              <button
                type="button"
                className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ajinomoto-red"
              >
                <div className="hidden md:block mr-2 text-right">
                  <div className="text-sm font-medium text-ajinomoto-gray-900">{user?.name}</div>
                  <div className="text-xs text-ajinomoto-gray-500">{user?.role}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-ajinomoto-blue text-white flex items-center justify-center">
                  <User size={18} />
                </div>
              </button>
              
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden">
                <a href="#" className="block px-4 py-2 text-sm text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    Profil
                  </div>
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100">
                  <div className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    Pengaturan
                  </div>
                </a>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100"
                >
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Keluar
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
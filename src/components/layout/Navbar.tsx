import React, { useState } from 'react';
import { Bell, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRFIDStore } from '../../store/rfidStore';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const { alerts } = useRFIDStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.resolved).length;
  
  return (
    <header className="bg-white border-b border-ajinomoto-gray-200 shadow-sm z-20 relative">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Modern Toggle Button */}
            <button
              type="button"
              className="group relative p-2 rounded-lg text-ajinomoto-gray-500 hover:text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ajinomoto-red transition-all duration-300 ease-in-out"
              onClick={onMenuClick}
            >
              <div className="relative w-6 h-6">
                {/* Animated hamburger/close icon */}
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'opacity-0' : 'translate-y-2.5'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                  }`}
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-ajinomoto-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {sidebarOpen ? 'Close menu' : 'Open menu'}
              </div>
            </button>
            
            <div className="ml-4 flex lg:ml-6">
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
                className="group relative flex rounded-full bg-white text-ajinomoto-gray-600 hover:text-ajinomoto-red focus:outline-none focus:ring-2 focus:ring-ajinomoto-red transition-all duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="relative p-2">
                  <Bell size={22} className="transition-transform duration-200 group-hover:scale-110" />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ajinomoto-red text-xs text-white animate-pulse">
                      {unreadAlerts > 9 ? '9+' : unreadAlerts}
                    </span>
                  )}
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 ease-out">
                  <div className="px-4 py-3 border-b border-ajinomoto-gray-200 bg-ajinomoto-gray-50 rounded-t-lg">
                    <h3 className="text-sm font-semibold text-ajinomoto-gray-900">Notifications</h3>
                    {unreadAlerts > 0 && (
                      <p className="text-xs text-ajinomoto-gray-500 mt-1">{unreadAlerts} unread</p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className="px-4 py-3 hover:bg-ajinomoto-gray-50 cursor-pointer transition-colors duration-150 border-b border-ajinomoto-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start">
                          <div className={`p-1.5 rounded-full ${
                            alert.resolved ? 'bg-ajinomoto-gray-200' : 'bg-red-100'
                          } mr-3 flex-shrink-0`}>
                            <Bell size={14} className={
                              alert.resolved ? 'text-ajinomoto-gray-500' : 'text-red-500'
                            } />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ajinomoto-gray-900 truncate">
                              {alert.message}
                            </p>
                            <p className="text-xs text-ajinomoto-gray-500 mt-1">
                              {format(alert.timestamp, 'dd MMM yyyy HH:mm')}
                              {alert.resolved && ' • Resolved'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-ajinomoto-gray-200 bg-ajinomoto-gray-50 rounded-b-lg">
                    <Link
                      to="/notifications"
                      className="text-sm text-ajinomoto-red hover:text-ajinomoto-red-700 font-medium transition-colors duration-150"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative ml-4">
              <button
                type="button"
                className="group flex items-center rounded-lg bg-white text-sm hover:bg-ajinomoto-gray-50 focus:outline-none focus:ring-2 focus:ring-ajinomoto-red transition-all duration-200 p-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="hidden md:block mr-3 text-right">
                  <div className="text-sm font-medium text-ajinomoto-gray-900">{user?.name}</div>
                  <div className="text-xs text-ajinomoto-gray-500 capitalize">{user?.role}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ajinomoto-red to-ajinomoto-blue text-white flex items-center justify-center font-medium text-sm group-hover:scale-105 transition-transform duration-200">
                  {user?.name?.charAt(0) || <User size={16} />}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 ease-out">
                  <div className="px-4 py-3 border-b border-ajinomoto-gray-200 bg-ajinomoto-gray-50 rounded-t-lg">
                    <p className="text-sm font-medium text-ajinomoto-gray-900">{user?.name}</p>
                    <p className="text-xs text-ajinomoto-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="group flex items-center px-4 py-2 text-sm text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100 hover:text-ajinomoto-gray-900 transition-colors duration-150"
                    >
                      <User size={16} className="mr-3 text-ajinomoto-gray-400 group-hover:text-ajinomoto-gray-500" />
                      Profile Settings
                    </Link>
                    <Link
                      to="/settings"
                      className="group flex items-center px-4 py-2 text-sm text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100 hover:text-ajinomoto-gray-900 transition-colors duration-150"
                    >
                      <Settings size={16} className="mr-3 text-ajinomoto-gray-400 group-hover:text-ajinomoto-gray-500" />
                      System Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-ajinomoto-gray-200">
                    <button
                      onClick={logout}
                      className="group flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors duration-150 rounded-b-lg"
                    >
                      <LogOut size={16} className="mr-3 text-red-500 group-hover:text-red-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
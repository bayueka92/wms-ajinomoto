import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AlertBanner } from '../../types';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertBanner, setAlertBanner] = useState<AlertBanner | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showAlert = (message: string, type: AlertBanner['type'] = 'info') => {
    setAlertBanner({ message, type });
    setTimeout(() => setAlertBanner(null), 5000);
  };

  return (
    <div className="flex h-screen bg-ajinomoto-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-ajinomoto-gray-50 to-white p-4 md:p-6">
          {alertBanner && (
            <div 
              className={`mb-6 p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 ${
                alertBanner.type === 'error' ? 'bg-red-50 text-red-800 border-red-400' :
                alertBanner.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-400' :
                alertBanner.type === 'success' ? 'bg-green-50 text-green-800 border-green-400' :
                'bg-blue-50 text-blue-800 border-blue-400'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  {alertBanner.message}
                </div>
                <button
                  onClick={() => setAlertBanner(null)}
                  className="ml-4 text-current hover:opacity-70 transition-opacity duration-150"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          <div className="transition-all duration-300 ease-in-out">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
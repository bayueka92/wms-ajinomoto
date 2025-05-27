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
    <div className="flex h-screen bg-ajinomoto-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-ajinomoto-gray-50 p-4">
          {alertBanner && (
            <div 
              className={`mb-4 p-4 rounded-md ${
                alertBanner.type === 'error' ? 'bg-red-100 text-red-800' :
                alertBanner.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                alertBanner.type === 'success' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}
            >
              {alertBanner.message}
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Box,
  Home,
  Layers,
  LogOut,
  QrCode,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive, isCollapsed }) => {
  return (
    <Link
      to={to}
      className={`group relative flex items-center px-3 py-2.5 my-1 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-ajinomoto-red to-red-600 text-white shadow-lg'
          : 'text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-100 hover:text-ajinomoto-gray-900'
      }`}
    >
      <span className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>
      
      <span className={`ml-3 transition-all duration-300 ${
        isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}>
        {label}
      </span>
      
      {isActive && (
        <ChevronRight 
          size={16} 
          className={`ml-auto transition-all duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`} 
        />
      )}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-ajinomoto-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          onClick={() => {}} // This will be handled by the parent component
        />
      )}
      
      <aside
        className={`fixed md:relative inset-y-0 left-0 bg-white shadow-xl z-30 transition-all duration-300 ease-in-out border-r border-ajinomoto-gray-200 ${
          isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-center h-16 border-b border-ajinomoto-gray-200 bg-gradient-to-r from-ajinomoto-red to-red-600 ${
            isOpen ? 'px-4' : 'px-2'
          }`}>
            <div className="transition-all duration-300">
              {isOpen ? (
                <div className="flex items-center">
                  <img
                    src="https://www.ajinomoto.co.id/template/ajinomoto/logo/aji-logo-new2.svg"
                    alt="Ajinomoto Logo"
                    className="h-8 filter brightness-0 invert"
                  />
                  <span className="ml-2 text-white font-bold text-lg">WMS</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-ajinomoto-red text-lg font-bold shadow-lg">
                  A
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-white to-ajinomoto-gray-50">
            <nav className="space-y-1">
              <SidebarItem
                to="/"
                icon={<Home size={20} />}
                label="Dashboard"
                isActive={location.pathname === '/'}
                isCollapsed={!isOpen}
              />

              {/* Data Master Section */}
              <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
                <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-2 transition-all duration-300 ${
                  !isOpen ? 'opacity-0 h-0 mb-0' : 'opacity-100'
                }`}>
                  Data Master
                </h3>
              </div>

              <SidebarItem
                to="/produk"
                icon={<Box size={20} />}
                label="Produk"
                isActive={location.pathname === '/produk'}
                isCollapsed={!isOpen}
              />

              <SidebarItem
                to="/rfid-tags"
                icon={<QrCode size={20} />}
                label="RFID Tags"
                isActive={location.pathname === '/rfid-tags'}
                isCollapsed={!isOpen}
              />

              {/* Inventory Section */}
              <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
                <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-2 transition-all duration-300 ${
                  !isOpen ? 'opacity-0 h-0 mb-0' : 'opacity-100'
                }`}>
                  Inventory
                </h3>
              </div>

              <SidebarItem
                to="/barang-masuk"
                icon={<Truck size={20} />}
                label="Barang Masuk"
                isActive={location.pathname === '/barang-masuk'}
                isCollapsed={!isOpen}
              />

              <SidebarItem
                to="/barang-keluar"
                icon={<ShoppingCart size={20} />}
                label="Barang Keluar"
                isActive={location.pathname === '/barang-keluar'}
                isCollapsed={!isOpen}
              />

              {/* Warehouse Section */}
              <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
                <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-2 transition-all duration-300 ${
                  !isOpen ? 'opacity-0 h-0 mb-0' : 'opacity-100'
                }`}>
                  Warehouse
                </h3>
              </div>

              <SidebarItem
                to="/warehouse"
                icon={<Warehouse size={20} />}
                label="Warehouse Rack"
                isActive={location.pathname === '/warehouse'}
                isCollapsed={!isOpen}
              />

              <SidebarItem
                to="/lokasi"
                icon={<Layers size={20} />}
                label="Lokasi"
                isActive={location.pathname === '/lokasi'}
                isCollapsed={!isOpen}
              />

              {/* Reports Section */}
              <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
                <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-2 transition-all duration-300 ${
                  !isOpen ? 'opacity-0 h-0 mb-0' : 'opacity-100'
                }`}>
                  Laporan
                </h3>
              </div>

              <SidebarItem
                to="/laporan"
                icon={<BarChart3 size={20} />}
                label="Laporan"
                isActive={location.pathname === '/laporan'}
                isCollapsed={!isOpen}
              />

              {/* System Section */}
              <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
                <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-2 transition-all duration-300 ${
                  !isOpen ? 'opacity-0 h-0 mb-0' : 'opacity-100'
                }`}>
                  Sistem
                </h3>
              </div>

              <SidebarItem
                to="/pengguna"
                icon={<Users size={20} />}
                label="Pengguna"
                isActive={location.pathname === '/pengguna'}
                isCollapsed={!isOpen}
              />

              <SidebarItem
                to="/pengaturan"
                icon={<Settings size={20} />}
                label="Pengaturan"
                isActive={location.pathname === '/pengaturan'}
                isCollapsed={!isOpen}
              />

              <SidebarItem
                to="/readers"
                icon={<Wifi size={20} />}
                label="RFID Readers"
                isActive={location.pathname === '/readers'}
                isCollapsed={!isOpen}
              />
            </nav>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-ajinomoto-gray-200 bg-ajinomoto-gray-50">
            <button
              onClick={logout}
              className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium text-ajinomoto-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <LogOut size={20} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <span className={`ml-3 transition-all duration-300 ${
                !isOpen ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}>
                Keluar
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-ajinomoto-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  Keluar
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
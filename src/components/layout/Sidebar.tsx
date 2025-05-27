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
  Wifi
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
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 my-1 text-sm font-medium rounded-md group transition-colors ${
        isActive
          ? 'bg-ajinomoto-red text-white'
          : 'text-ajinomoto-gray-700 hover:bg-ajinomoto-gray-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  
  return (
    <aside
      className={`bg-white shadow-sm h-screen z-20 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'
      } border-r border-ajinomoto-gray-200`}
    >
      <div className="h-full flex flex-col">
        <div className={`flex items-center justify-center h-16 border-b border-ajinomoto-gray-200 ${
          isOpen ? 'px-4' : 'px-2'
        }`}>
          {isOpen ? (
            <img
              src="https://www.ajinomoto.co.id/template/ajinomoto/logo/aji-logo-new2.svg"
              alt="Ajinomoto Logo"
              className="h-8"
            />
          ) : (
            <div className="w-8 h-8 bg-ajinomoto-red rounded-md flex items-center justify-center text-white text-lg font-bold">
              A
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1">
            <SidebarItem
              to="/"
              icon={<Home size={20} />}
              label="Dashboard"
              isActive={location.pathname === '/'}
            />
            
            <div className="pt-2 mt-2 border-t border-ajinomoto-gray-200">
              <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-1 ${!isOpen && 'sr-only'}`}>
                Inventory
              </h3>
            </div>
            
            <SidebarItem
              to="/barang-masuk"
              icon={<Truck size={20} />}
              label="Barang Masuk"
              isActive={location.pathname === '/barang-masuk'}
            />
            
            <SidebarItem
              to="/barang-keluar"
              icon={<ShoppingCart size={20} />}
              label="Barang Keluar"
              isActive={location.pathname === '/barang-keluar'}
            />
            
            <SidebarItem
              to="/produk"
              icon={<Box size={20} />}
              label="Produk"
              isActive={location.pathname === '/produk'}
            />
            
            <SidebarItem
              to="/rfid-tags"
              icon={<QrCode size={20} />}
              label="RFID Tags"
              isActive={location.pathname === '/rfid-tags'}
            />
            
            <div className="pt-2 mt-2 border-t border-ajinomoto-gray-200">
              <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-1 ${!isOpen && 'sr-only'}`}>
                Warehouse
              </h3>
            </div>
            
            <SidebarItem
              to="/warehouse"
              icon={<Warehouse size={20} />}
              label="Warehouse 3D"
              isActive={location.pathname === '/warehouse'}
            />
            
            <SidebarItem
              to="/lokasi"
              icon={<Layers size={20} />}
              label="Lokasi"
              isActive={location.pathname === '/lokasi'}
            />
            
            <SidebarItem
              to="/readers"
              icon={<Wifi size={20} />}
              label="RFID Readers"
              isActive={location.pathname === '/readers'}
            />
            
            <div className="pt-2 mt-2 border-t border-ajinomoto-gray-200">
              <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-1 ${!isOpen && 'sr-only'}`}>
                Laporan
              </h3>
            </div>
            
            <SidebarItem
              to="/laporan"
              icon={<BarChart3 size={20} />}
              label="Laporan"
              isActive={location.pathname === '/laporan'}
            />
            
            <div className="pt-2 mt-2 border-t border-ajinomoto-gray-200">
              <h3 className={`text-xs uppercase tracking-wider text-ajinomoto-gray-500 font-semibold px-3 mb-1 ${!isOpen && 'sr-only'}`}>
                Sistem
              </h3>
            </div>
            
            <SidebarItem
              to="/pengguna"
              icon={<Users size={20} />}
              label="Pengguna"
              isActive={location.pathname === '/pengguna'}
            />
            
            <SidebarItem
              to="/pengaturan"
              icon={<Settings size={20} />}
              label="Pengaturan"
              isActive={location.pathname === '/pengaturan'}
            />
          </nav>
        </div>
        
        <div className="p-3 border-t border-ajinomoto-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-ajinomoto-gray-700 rounded-md hover:bg-ajinomoto-gray-200 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className={!isOpen ? 'sr-only' : ''}>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
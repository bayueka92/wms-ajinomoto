import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './store/authStore';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BarangMasuk from './pages/BarangMasuk';
import BarangKeluar from './pages/BarangKeluar';
import Produk from './pages/Produk';
import RFIDTags from './pages/RFIDTags';
import RFIDReaders from './pages/RFIDReaders';
import Warehouse from './pages/Warehouse';
import Lokasi from './pages/Lokasi';
import Laporan from './pages/Laporan';
import Pengguna from './pages/Pengguna';
import Pengaturan from './pages/Pengaturan';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="./login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  
  // Set page title
  useEffect(() => {
    document.title = 'PT AJINOMOTO - Warehouse Management System';
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="./\" replace />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="barang-masuk" element={<BarangMasuk />} />
          <Route path="barang-keluar" element={<BarangKeluar />} />
          <Route path="produk" element={<Produk />} />
          <Route path="rfid-tags" element={<RFIDTags />} />
          <Route path="readers" element={<RFIDReaders />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="lokasi" element={<Lokasi />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="pengguna" element={<Pengguna />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>
        
        <Route path="*" element={<Navigate to="./\" replace />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
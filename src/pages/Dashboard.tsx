import React, { useState } from 'react';
import { 
  BarChart3, 
  Box, 
  TrendingDown, 
  TrendingUp,
  Truck,
  ShoppingCart,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { StatsCard } from '../components/ui/Stats';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useRFIDStore } from '../store/rfidStore';
import { useWarehouseStore } from '../store/warehouseStore';
import { WarehouseVisualization } from '../components/warehouse/WarehouseVisualization';
import { Button } from '../components/ui/Button';
import { GoodsEntryForm } from '../components/inventory/GoodsEntryForm';
import { GoodsExitForm } from '../components/inventory/GoodsExitForm';
import { UnauthorizedAlertModal } from '../components/alerts/UnauthorizedAlertModal';
import { Alert } from '../components/ui/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { rfidTags, movements, alerts, products } = useRFIDStore();
  const { getCapacityUtilization, getZoneStatistics } = useWarehouseStore();
  
  const [showGoodsEntryForm, setShowGoodsEntryForm] = useState(false);
  const [showGoodsExitForm, setShowGoodsExitForm] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.resolved).length;
  
  // Statistics
  const capacityUtilization = getCapacityUtilization();
  const zoneStats = getZoneStatistics();
  
  // Prepare chart data
  const zoneData = Object.entries(zoneStats).map(([zone, stats]) => ({
    name: `Zone ${zone}`,
    value: stats.utilization,
  }));
  
  const movementData = [
    { name: 'Sen', in: 12, out: 8 },
    { name: 'Sel', in: 15, out: 10 },
    { name: 'Rab', in: 18, out: 12 },
    { name: 'Kam', in: 14, out: 9 },
    { name: 'Jum', in: 16, out: 11 },
    { name: 'Sab', in: 10, out: 7 },
    { name: 'Min', in: 5, out: 3 },
  ];
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Dashboard WMS RFID</h1>
        <p className="text-ajinomoto-gray-500">Pantau aktivitas gudang dan informasi inventaris secara real-time.</p>
      </div>
      
      {unreadAlerts > 0 && (
        <div className="mb-6">
          <Alert
            variant="error"
            title="Peringatan Aktif"
            onClose={() => {}}
          >
            <p className="mb-2">
              Ada {unreadAlerts} peringatan yang memerlukan perhatian segera.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowAlertModal(true)}
            >
              Lihat Peringatan
            </Button>
          </Alert>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Produk"
          value={products.length}
          icon={<Box size={24} />}
          change={5}
          changeText="dari bulan lalu"
        />
        
        <StatsCard
          title="RFID Tags Aktif"
          value={rfidTags.filter(tag => tag.status === 'active').length}
          icon={<Layers size={24} />}
          change={8}
          changeText="dari bulan lalu"
        />
        
        <StatsCard
          title="Barang Masuk (Hari Ini)"
          value={movements.filter(m => 
            m.type === 'in' && 
            m.timestamp.getDate() === new Date().getDate()
          ).length}
          icon={<Truck size={24} />}
          change={12}
          changeText="dari kemarin"
        />
        
        <StatsCard
          title="Barang Keluar (Hari Ini)"
          value={movements.filter(m => 
            m.type === 'out' && 
            m.timestamp.getDate() === new Date().getDate()
          ).length}
          icon={<ShoppingCart size={24} />}
          change={-3}
          changeText="dari kemarin"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Visualisasi Gudang 3D</CardTitle>
                <div className="text-sm text-ajinomoto-gray-500">
                  Kapasitas: {capacityUtilization.toFixed(1)}% terisi
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WarehouseVisualization />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pemanfaatan Kapasitas per Zona</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Terisi']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#E61E25" 
                    radius={[4, 4, 0, 0]}
                    name="Terisi"
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Status Kapasitas:</h4>
                <div className="space-y-2">
                  {Object.entries(zoneStats).map(([zone, stats]) => (
                    <div key={zone} className="flex items-center justify-between">
                      <span className="text-sm">Zone {zone}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ajinomoto-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              stats.utilization < 50 ? 'bg-success' :
                              stats.utilization < 80 ? 'bg-warning' :
                              'bg-error'
                            }`}
                            style={{ width: `${stats.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{stats.utilization.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Pergerakan Barang</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="in" name="Barang Masuk" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" name="Barang Keluar" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 flex gap-4">
              <Button
                variant="primary"
                leftIcon={<Truck size={16} />}
                onClick={() => setShowGoodsEntryForm(true)}
              >
                Barang Masuk
              </Button>
              
              <Button
                variant="secondary"
                leftIcon={<ShoppingCart size={16} />}
                onClick={() => setShowGoodsExitForm(true)}
              >
                Barang Keluar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peringatan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-md border ${
                      alert.resolved 
                        ? 'bg-ajinomoto-gray-50 border-ajinomoto-gray-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-1 rounded-full ${
                        alert.resolved ? 'bg-ajinomoto-gray-200' : 'bg-red-100'
                      } mr-3`}>
                        <AlertTriangle size={16} className={
                          alert.resolved ? 'text-ajinomoto-gray-500' : 'text-red-500'
                        } />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          alert.resolved ? 'text-ajinomoto-gray-700' : 'text-red-700'
                        }`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-ajinomoto-gray-500 mt-1">
                          {alert.timestamp.toLocaleString('id-ID')}
                          {alert.resolved && ' • Resolved'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-ajinomoto-gray-500">
                  <p>Tidak ada peringatan terbaru</p>
                </div>
              )}
              
              {alerts.length > 5 && (
                <div className="text-center mt-2">
                  <Button variant="outline" size="sm">
                    Lihat Semua Peringatan
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Forms */}
      <GoodsEntryForm
        isOpen={showGoodsEntryForm}
        onClose={() => setShowGoodsEntryForm(false)}
      />
      
      <GoodsExitForm
        isOpen={showGoodsExitForm}
        onClose={() => setShowGoodsExitForm(false)}
      />
      
      <UnauthorizedAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
};

export default Dashboard;
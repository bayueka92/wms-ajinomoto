import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, Bell, Shield, Database, Printer, Wifi } from 'lucide-react';

const Pengaturan: React.FC = () => {
  // Mock settings data
  const [settings, setSettings] = useState({
    companyName: 'PT Ajinomoto Indonesia',
    warehouseName: 'Gudang Utama',
    address: 'Jl. Industri No. 123, Kawasan Industri MM2100, Bekasi',
    email: 'warehouse@ajinomoto.co.id',
    phone: '021-1234567',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    alertThreshold: 80,
    
    // Security settings
    requireTwoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // RFID settings
    scanInterval: 5,
    readerTimeout: 30,
    alarmDelay: 3,
    
    // Printer settings
    defaultPrinter: 'RFID Label Printer 01',
    labelWidth: 100,
    labelHeight: 60,
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Pengaturan</h1>
          <p className="text-ajinomoto-gray-500">Konfigurasi sistem dan preferensi</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Save size={16} />}
          onClick={handleSave}
        >
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nama Perusahaan"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                fullWidth
              />
              
              <Input
                label="Nama Gudang"
                value={settings.warehouseName}
                onChange={(e) => setSettings({ ...settings, warehouseName: e.target.value })}
                fullWidth
              />
              
              <Input
                label="Alamat"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                fullWidth
              />
              
              <Input
                label="Email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                fullWidth
              />
              
              <Input
                label="Telepon"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bell size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Notifikasi</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ajinomoto-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-ajinomoto-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ajinomoto-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ajinomoto-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ajinomoto-red"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ajinomoto-gray-700">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-ajinomoto-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ajinomoto-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ajinomoto-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ajinomoto-red"></div>
                </label>
              </div>

              <Input
                label="Batas Peringatan Stok (%)"
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Keamanan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ajinomoto-gray-700">Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.requireTwoFactor}
                    onChange={(e) => setSettings({ ...settings, requireTwoFactor: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-ajinomoto-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ajinomoto-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ajinomoto-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ajinomoto-red"></div>
                </label>
              </div>

              <Input
                label="Timeout Sesi (menit)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                fullWidth
              />

              <Input
                label="Masa Berlaku Password (hari)"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })}
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Wifi size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>RFID</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Interval Scan (detik)"
                type="number"
                value={settings.scanInterval}
                onChange={(e) => setSettings({ ...settings, scanInterval: parseInt(e.target.value) })}
                fullWidth
              />

              <Input
                label="Timeout Reader (detik)"
                type="number"
                value={settings.readerTimeout}
                onChange={(e) => setSettings({ ...settings, readerTimeout: parseInt(e.target.value) })}
                fullWidth
              />

              <Input
                label="Delay Alarm (detik)"
                type="number"
                value={settings.alarmDelay}
                onChange={(e) => setSettings({ ...settings, alarmDelay: parseInt(e.target.value) })}
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Printer size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Printer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Printer Default"
                value={settings.defaultPrinter}
                onChange={(e) => setSettings({ ...settings, defaultPrinter: e.target.value })}
                fullWidth
              />

              <Input
                label="Lebar Label (mm)"
                type="number"
                value={settings.labelWidth}
                onChange={(e) => setSettings({ ...settings, labelWidth: parseInt(e.target.value) })}
                fullWidth
              />

              <Input
                label="Tinggi Label (mm)"
                type="number"
                value={settings.labelHeight}
                onChange={(e) => setSettings({ ...settings, labelHeight: parseInt(e.target.value) })}
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Database size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Database & Backup</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-ajinomoto-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Backup Terakhir</h4>
                <p className="text-sm text-ajinomoto-gray-500">2024-02-20 15:30:00</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="primary">
                  Backup Sekarang
                </Button>
                <Button variant="outline">
                  Restore Backup
                </Button>
              </div>

              <div className="border-t border-ajinomoto-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">Pembersihan Data</h4>
                <Button variant="danger">
                  Bersihkan Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pengaturan;
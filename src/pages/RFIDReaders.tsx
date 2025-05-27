import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wifi, PlusCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RFIDReaderForm } from '../components/rfid/RFIDReaderForm';

const RFIDReaders: React.FC = () => {
  const { rfidReaders, updateReaderStatus } = useRFIDStore();
  const [showReaderForm, setShowReaderForm] = useState(false);
  
  const handleStatusUpdate = async (readerId: string, status: 'active' | 'inactive' | 'maintenance') => {
    await updateReaderStatus(readerId, status);
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">RFID Readers</h1>
          <p className="text-ajinomoto-gray-500">Kelola dan monitor seluruh RFID reader dalam sistem</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowReaderForm(true)}
        >
          Tambah Reader
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rfidReaders.map((reader) => (
          <Card key={reader.id} className="overflow-hidden">
            <CardHeader className={`
              ${reader.status === 'active' ? 'bg-green-50' : 
                reader.status === 'inactive' ? 'bg-ajinomoto-gray-100' : 
                'bg-yellow-50'}
            `}>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Wifi size={18} className="mr-2" />
                  {reader.name}
                </CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reader.status === 'active' ? 'bg-green-100 text-green-800' : 
                  reader.status === 'inactive' ? 'bg-ajinomoto-gray-200 text-ajinomoto-gray-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {reader.status === 'active' ? 'Aktif' : 
                   reader.status === 'inactive' ? 'Tidak Aktif' : 
                   'Maintenance'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-ajinomoto-gray-500">Tipe</p>
                  <p className="text-ajinomoto-gray-900">{reader.type === 'fixed' ? 'Fixed Reader' : 'Handheld Reader'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-ajinomoto-gray-500">Lokasi</p>
                  <p className="text-ajinomoto-gray-900">{reader.location}</p>
                </div>
                
                {reader.lastActive && (
                  <div>
                    <p className="text-sm font-medium text-ajinomoto-gray-500">Terakhir Aktif</p>
                    <p className="text-ajinomoto-gray-900">{reader.lastActive.toLocaleString('id-ID')}</p>
                  </div>
                )}
                
                {reader.lastMaintenance && (
                  <div>
                    <p className="text-sm font-medium text-ajinomoto-gray-500">Maintenance Terakhir</p>
                    <p className="text-ajinomoto-gray-900">{reader.lastMaintenance.toLocaleString('id-ID')}</p>
                  </div>
                )}
                
                <div className="pt-3 border-t border-ajinomoto-gray-200 mt-3">
                  <p className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Aksi</p>
                  <div className="flex space-x-2">
                    {reader.status !== 'active' && (
                      <Button
                        variant="success"
                        size="sm"
                        leftIcon={<CheckCircle2 size={14} />}
                        onClick={() => handleStatusUpdate(reader.id, 'active')}
                      >
                        Aktifkan
                      </Button>
                    )}
                    
                    {reader.status !== 'maintenance' && (
                      <Button
                        variant="warning"
                        size="sm"
                        leftIcon={<AlertTriangle size={14} />}
                        onClick={() => handleStatusUpdate(reader.id, 'maintenance')}
                      >
                        Maintenance
                      </Button>
                    )}
                    
                    {reader.status !== 'inactive' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(reader.id, 'inactive')}
                      >
                        Nonaktifkan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty state */}
      {rfidReaders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-ajinomoto-gray-200 mt-6">
          <Wifi size={48} className="mx-auto text-ajinomoto-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-ajinomoto-gray-900">Tidak ada RFID reader</h3>
          <p className="mt-2 text-sm text-ajinomoto-gray-500">Tambahkan RFID reader untuk mulai memantau pergerakan barang</p>
          <div className="mt-6">
            <Button
              variant="primary"
              leftIcon={<PlusCircle size={16} />}
              onClick={() => setShowReaderForm(true)}
            >
              Tambah Reader
            </Button>
          </div>
        </div>
      )}
      
      <RFIDReaderForm
        isOpen={showReaderForm}
        onClose={() => setShowReaderForm(false)}
      />
    </div>
  );
};

export default RFIDReaders;
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { AlertTriangle } from 'lucide-react';
import { useRFIDStore } from '../../store/rfidStore';

interface UnauthorizedAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertId?: string;
}

export const UnauthorizedAlertModal: React.FC<UnauthorizedAlertModalProps> = ({ 
  isOpen, 
  onClose,
  alertId = 'alert-1' // Default for demo
}) => {
  const { alerts, products, resolveAlert } = useRFIDStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const alert = alerts.find(a => a.id === alertId);
  const product = alert?.productId ? products.find(p => p.id === alert.productId) : null;
  
  if (!alert) return null;
  
  const handleResolve = async () => {
    setIsProcessing(true);
    
    try {
      await resolveAlert(alertId, '1'); // '1' is user ID
      onClose();
    } catch (error) {
      console.error('Error resolving alert:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Peringatan Keamanan"
      size="md"
    >
      <div className="mb-5">
        <Alert
          variant="error"
          title="Pergerakan Tidak Sah Terdeteksi!"
          icon={<AlertTriangle size={24} className="text-red-600" />}
        >
          <p className="mb-2">
            Sistem telah mendeteksi pergerakan barang yang tidak sesuai prosedur.
          </p>
        </Alert>
      </div>
      
      <div className="mb-5">
        <div className="bg-ajinomoto-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-3">Detail Peringatan:</h4>
          
          <div className="space-y-2">
            <div className="flex">
              <span className="text-sm font-medium text-ajinomoto-gray-500 w-32">Waktu:</span>
              <span className="text-sm">{alert.timestamp.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex">
              <span className="text-sm font-medium text-ajinomoto-gray-500 w-32">Level Keparahan:</span>
              <span className={`text-sm font-medium ${
                alert.severity === 'critical' ? 'text-error' : 
                alert.severity === 'high' ? 'text-error' : 
                alert.severity === 'medium' ? 'text-warning' : 
                'text-info'
              }`}>
                {alert.severity === 'critical' ? 'Kritis' : 
                 alert.severity === 'high' ? 'Tinggi' : 
                 alert.severity === 'medium' ? 'Sedang' : 
                 'Rendah'}
              </span>
            </div>
            
            {product && (
              <div className="flex">
                <span className="text-sm font-medium text-ajinomoto-gray-500 w-32">Produk:</span>
                <span className="text-sm">{product.name}</span>
              </div>
            )}
            
            <div className="flex">
              <span className="text-sm font-medium text-ajinomoto-gray-500 w-32">RFID Tag:</span>
              <span className="text-sm font-mono">{alert.rfidTagId}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Tindakan yang Direkomendasikan:</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Segera periksa lokasi di mana RFID tag terakhir terdeteksi</li>
          <li>Hubungi petugas keamanan untuk menyelidiki</li>
          <li>Pastikan semua barang berpindah melalui jalur yang tepat</li>
          <li>Periksa log sistem untuk pergerakan sebelumnya</li>
        </ul>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Tutup
        </Button>
        
        <Button
          variant="primary"
          isLoading={isProcessing}
          onClick={handleResolve}
        >
          Tandai Sebagai Selesai
        </Button>
      </div>
    </Modal>
  );
};
import React, { useState } from 'react';
import { useRFIDStore } from '../../store/rfidStore';
import { useWarehouseStore } from '../../store/warehouseStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArrowRightCircle, ShoppingCart, QrCode } from 'lucide-react';

interface GoodsExitFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoodsExitForm: React.FC<GoodsExitFormProps> = ({ isOpen, onClose }) => {
  const { products, rfidTags, recordMovement } = useRFIDStore();
  const { locations } = useWarehouseStore();
  
  const [step, setStep] = useState(1);
  const [rfidTagId, setRfidTagId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const selectedTag = rfidTags.find(tag => tag.id === rfidTagId);
  const selectedProduct = selectedTag ? products.find(p => p.id === selectedTag.productId) : null;
  const selectedLocation = selectedTag?.locationId ? locations.find(loc => loc.id === selectedTag.locationId) : null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would create the goods exit record
      await recordMovement({
        type: 'out',
        productId: selectedTag?.productId || '',
        rfidTagId,
        fromLocationId: selectedTag?.locationId,
        quantity: parseInt(quantity),
        status: 'completed',
        userId: '1', // In real app, this would be the current user ID
        notes: `Destination: ${destinationName}, Reason: ${reason}`,
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error recording goods exit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setStep(1);
    setRfidTagId('');
    setQuantity('');
    setDestinationName('');
    setReason('');
    setIsSuccess(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const renderStep1 = () => (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
          RFID Tag
        </label>
        <select
          className="w-full rounded-md border-ajinomoto-gray-300 shadow-sm focus:border-ajinomoto-red focus:ring focus:ring-ajinomoto-red focus:ring-opacity-50"
          value={rfidTagId}
          onChange={(e) => setRfidTagId(e.target.value)}
          required
        >
          <option value="">-- Pilih RFID Tag --</option>
          {rfidTags.map((tag) => {
            const product = products.find(p => p.id === tag.productId);
            return (
              <option key={tag.id} value={tag.id}>
                {tag.tagId} - {product?.name || 'Unknown Product'}
              </option>
            );
          })}
        </select>
      </div>
      
      <div className="mb-4">
        <Input
          label="Jumlah"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          required
          min="1"
        />
      </div>
      
      {selectedTag && selectedProduct && (
        <div className="mb-4 p-4 rounded-md bg-ajinomoto-gray-50">
          <h4 className="font-medium mb-2">Detail Produk:</h4>
          <p className="text-sm mb-1">Nama: {selectedProduct.name}</p>
          <p className="text-sm mb-1">SKU: {selectedProduct.sku}</p>
          <p className="text-sm mb-1">Tag ID: {selectedTag.tagId}</p>
          {selectedLocation && (
            <p className="text-sm">Lokasi: {selectedLocation.name} ({selectedLocation.code})</p>
          )}
        </div>
      )}
    </div>
  );
  
  const renderStep2 = () => (
    <div>
      <div className="mb-4">
        <Input
          label="Tujuan"
          value={destinationName}
          onChange={(e) => setDestinationName(e.target.value)}
          fullWidth
          required
          placeholder="e.g., Distributor Jakarta, Customer XYZ"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
          Alasan Pengeluaran
        </label>
        <select
          className="w-full rounded-md border-ajinomoto-gray-300 shadow-sm focus:border-ajinomoto-red focus:ring focus:ring-ajinomoto-red focus:ring-opacity-50"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        >
          <option value="">-- Pilih Alasan --</option>
          <option value="sales">Penjualan</option>
          <option value="distribution">Distribusi</option>
          <option value="return">Retur</option>
          <option value="damaged">Barang Rusak</option>
          <option value="expired">Barang Kedaluwarsa</option>
          <option value="other">Lainnya</option>
        </select>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
        <h4 className="text-yellow-800 font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Peringatan Alarm
        </h4>
        <p className="text-sm text-yellow-700">
          Pastikan barang dipindai oleh RFID reader saat meninggalkan gudang. Jika tidak, alarm akan berbunyi untuk mencegah kehilangan barang.
        </p>
      </div>
    </div>
  );
  
  const renderSuccess = () => (
    <div className="text-center py-4">
      <div className="bg-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-ajinomoto-gray-900 mb-2">Barang Berhasil Dikeluarkan!</h3>
      <p className="text-ajinomoto-gray-500">Barang telah berhasil dicatat dan dikeluarkan dari gudang.</p>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pendaftaran Barang Keluar"
      size="lg"
    >
      {isSuccess ? (
        renderSuccess()
      ) : (
        <form onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}
          
          <div className="mt-6 flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Kembali
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={step === 1 ? <ArrowRightCircle size={16} /> : <ShoppingCart size={16} />}
            >
              {step === 1 ? 'Lanjutkan' : 'Proses Barang Keluar'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
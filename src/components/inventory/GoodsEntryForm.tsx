import React, { useState } from 'react';
import { useRFIDStore } from '../../store/rfidStore';
import { useWarehouseStore } from '../../store/warehouseStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RFIDRegistrationForm } from '../rfid/RFIDRegistrationForm';
import { Printer, QrCode, Truck, ArrowRightCircle } from 'lucide-react';
import { Location } from '../../types';

interface GoodsEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoodsEntryForm: React.FC<GoodsEntryFormProps> = ({ isOpen, onClose }) => {
  const { products, recordMovement } = useRFIDStore();
  const { locations } = useWarehouseStore();
  
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [locationId, setLocationId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [showRFIDForm, setShowRFIDForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const storageLocations = locations.filter(location => 
    location.type === 'rack' || location.type === 'staging'
  );
  
  const selectedProduct = products.find(p => p.id === productId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would create the goods entry record
      await recordMovement({
        type: 'in',
        productId,
        rfidTagId: '1', // In real app, this would be the actual tag ID
        toLocationId: locationId,
        quantity: parseInt(quantity),
        status: 'completed',
        userId: '1', // In real app, this would be the current user ID
        notes: `Batch: ${batchNumber}`,
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error recording goods entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setStep(1);
    setProductId('');
    setQuantity('');
    setLocationId('');
    setBatchNumber('');
    setShowRFIDForm(false);
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
          Produk
        </label>
        <select
          className="w-full rounded-md border-ajinomoto-gray-300 shadow-sm focus:border-ajinomoto-red focus:ring focus:ring-ajinomoto-red focus:ring-opacity-50"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">-- Pilih Produk --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.sku}
            </option>
          ))}
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
      
      <div className="mb-4">
        <Input
          label="Nomor Batch"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          fullWidth
          placeholder="e.g., B2023-001"
        />
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
          Lokasi Penyimpanan
        </label>
        <select
          className="w-full rounded-md border-ajinomoto-gray-300 shadow-sm focus:border-ajinomoto-red focus:ring focus:ring-ajinomoto-red focus:ring-opacity-50"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          required
        >
          <option value="">-- Pilih Lokasi --</option>
          {storageLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.code}
            </option>
          ))}
        </select>
      </div>
      
      {selectedProduct && (
        <div className="mb-4 p-4 rounded-md bg-ajinomoto-gray-50">
          <h4 className="font-medium mb-2">Detail Produk:</h4>
          <p className="text-sm mb-1">Nama: {selectedProduct.name}</p>
          <p className="text-sm mb-1">SKU: {selectedProduct.sku}</p>
          <p className="text-sm mb-1">Kategori: {selectedProduct.category}</p>
          <p className="text-sm">Dimensi: {selectedProduct.dimensions.length}cm x {selectedProduct.dimensions.width}cm x {selectedProduct.dimensions.height}cm</p>
        </div>
      )}
    </div>
  );
  
  const renderSuccess = () => (
    <div className="text-center py-4">
      <div className="bg-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-ajinomoto-gray-900 mb-2">Barang Berhasil Didaftarkan!</h3>
      <p className="text-ajinomoto-gray-500">Barang telah berhasil dicatat dan disimpan di lokasi yang ditentukan.</p>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showRFIDForm ? 'Registrasi RFID Tag' : 'Pendaftaran Barang Masuk'}
      size="lg"
    >
      {showRFIDForm ? (
        <div>
          <RFIDRegistrationForm 
            onComplete={() => setShowRFIDForm(false)}
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowRFIDForm(false)}
            >
              Kembali
            </Button>
          </div>
        </div>
      ) : (
        <div>
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
                
                <div className="flex space-x-2">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="secondary"
                      leftIcon={<QrCode size={16} />}
                      onClick={() => setShowRFIDForm(true)}
                    >
                      Daftarkan RFID
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={step === 1 ? <ArrowRightCircle size={16} /> : <Truck size={16} />}
                  >
                    {step === 1 ? 'Lanjutkan' : 'Simpan Barang Masuk'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
};
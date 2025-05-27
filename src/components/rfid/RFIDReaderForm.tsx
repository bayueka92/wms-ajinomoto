import React, { useState } from 'react';
import { useRFIDStore } from '../../store/rfidStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wifi } from 'lucide-react';

interface RFIDReaderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RFIDReaderForm: React.FC<RFIDReaderFormProps> = ({ isOpen, onClose }) => {
  const { registerReader } = useRFIDStore();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'handheld' | 'fixed'>('fixed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await registerReader({
        name,
        location,
        type,
        status: 'active',
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error registering RFID reader:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setLocation('');
    setType('fixed');
    setIsSuccess(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const renderSuccess = () => (
    <div className="text-center py-4">
      <div className="bg-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-ajinomoto-gray-900 mb-2">RFID Reader Berhasil Ditambahkan!</h3>
      <p className="text-ajinomoto-gray-500">Reader telah berhasil didaftarkan dan siap digunakan.</p>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah RFID Reader"
      size="md"
    >
      {isSuccess ? (
        renderSuccess()
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Nama Reader"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              placeholder="e.g., Gate Reader 1, Handheld Scanner 2"
            />
          </div>
          
          <div className="mb-4">
            <Input
              label="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
              placeholder="e.g., Warehouse Entrance, Shipping Zone"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
              Tipe Reader
            </label>
            <div className="mt-1 space-y-2">
              <div className="flex items-center">
                <input
                  id="fixed"
                  name="readerType"
                  type="radio"
                  checked={type === 'fixed'}
                  onChange={() => setType('fixed')}
                  className="h-4 w-4 text-ajinomoto-red focus:ring-ajinomoto-red border-ajinomoto-gray-300"
                />
                <label htmlFor="fixed" className="ml-2 block text-sm text-ajinomoto-gray-700">
                  Fixed Reader (Gate, Portal, dll)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="handheld"
                  name="readerType"
                  type="radio"
                  checked={type === 'handheld'}
                  onChange={() => setType('handheld')}
                  className="h-4 w-4 text-ajinomoto-red focus:ring-ajinomoto-red border-ajinomoto-gray-300"
                />
                <label htmlFor="handheld" className="ml-2 block text-sm text-ajinomoto-gray-700">
                  Handheld Reader (Portabel)
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Wifi size={16} />}
            >
              Tambahkan Reader
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
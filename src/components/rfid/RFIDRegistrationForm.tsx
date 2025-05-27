import React, { useState } from 'react';
import { useRFIDStore } from '../../store/rfidStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { QrCode, Printer } from 'lucide-react';
import printJS from 'print-js';

interface RFIDRegistrationFormProps {
  onComplete?: () => void;
}

export const RFIDRegistrationForm: React.FC<RFIDRegistrationFormProps> = ({ onComplete }) => {
  const { products, registerRFIDTag } = useRFIDStore();
  const [productId, setProductId] = useState('');
  const [tagId, setTagId] = useState(`AJINO-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredTag, setRegisteredTag] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !tagId) return;
    
    setIsLoading(true);
    
    try {
      const newTag = await registerRFIDTag(productId, tagId);
      setIsSuccess(true);
      setRegisteredTag(newTag.tagId);
      setTimeout(() => {
        setIsSuccess(false);
        setTagId(`AJINO-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`);
      }, 3000);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error registering RFID tag:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrintTag = () => {
    // In a real app, this would generate a printable label
    // For now, we'll just print a simple HTML representation
    const selectedProduct = products.find(p => p.id === productId);
    
    if (!selectedProduct) return;
    
    const printContent = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 300px; border: 1px solid #ccc;">
        <div style="text-align: center; margin-bottom: 15px;">
          <h2 style="margin: 0; color: #E61E25;">AJINOMOTO</h2>
          <p style="margin: 5px 0; color: #1E3A8A; font-size: 14px;">WMS RFID System</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>Product:</strong> ${selectedProduct.name}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>SKU:</strong> ${selectedProduct.sku}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Category:</strong> ${selectedProduct.category}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Batch:</strong> ${selectedProduct.batchNumber || 'N/A'}</p>
        </div>
        
        <div style="text-align: center;">
          <div style="border: 1px solid #000; padding: 10px; display: inline-block; margin-bottom: 10px;">
            <div style="font-size: 30px; font-weight: bold; letter-spacing: 1px;">${registeredTag}</div>
          </div>
          <p style="margin: 5px 0; font-size: 12px;">RFID Tag ID</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 12px; color: #6B7280; text-align: center;">
          <p>Registered on: ${new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>
    `;
    
    printJS({
      printable: printContent,
      type: 'raw-html',
      style: '@page { size: 58mm 40mm; margin: 0; }',
    });
  };
  
  return (
    <div className="p-4 bg-white rounded-lg border border-ajinomoto-gray-200">
      <h3 className="text-lg font-semibold mb-4">Registrasi RFID Tag Baru</h3>
      
      {isSuccess ? (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          <div className="flex items-center mb-2">
            <QrCode size={20} className="mr-2" />
            <p className="font-medium">Tag RFID berhasil didaftarkan!</p>
          </div>
          <p className="text-sm mb-4">Tag ID: <span className="font-mono">{registeredTag}</span></p>
          
          <Button 
            variant="success" 
            size="sm"
            leftIcon={<Printer size={16} />}
            onClick={handlePrintTag}
          >
            Print Tag RFID
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
              label="Tag ID"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              fullWidth
              required
              leftIcon={<QrCode size={16} />}
            />
            <p className="mt-1 text-xs text-ajinomoto-gray-500">
              ID tag akan otomatis digenerate, tetapi dapat diubah jika diperlukan.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Daftarkan Tag
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
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
    const selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    const currentDate = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const printContent = `
      <div style="
        width: 300px;
        padding: 20px;
        font-family: 'Inter', sans-serif;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      ">
        <!-- Header -->
        <div style="
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px solid #E61E25;
        ">
          <div style="
            font-size: 24px;
            font-weight: bold;
            color: #E61E25;
            margin-bottom: 4px;
          ">AJINOMOTO</div>
          <div style="
            font-size: 12px;
            color: #1E3A8A;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">WMS RFID System</div>
        </div>

        <!-- RFID Tag -->
        <div style="
          text-align: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #F3F4F6;
          border-radius: 6px;
        ">
          <div style="
            font-family: monospace;
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            letter-spacing: 2px;
            margin-bottom: 8px;
          ">${registeredTag}</div>
          <div style="
            font-size: 10px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">RFID Tag ID</div>
        </div>

        <!-- Product Info -->
        <div style="margin-bottom: 20px;">
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Product</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right; font-weight: 500;">
                ${selectedProduct.name}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">SKU</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right; font-family: monospace;">
                ${selectedProduct.sku}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Category</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right;">
                ${selectedProduct.category}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Batch</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right; font-family: monospace;">
                ${selectedProduct.batchNumber || 'N/A'}
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="
          text-align: center;
          font-size: 10px;
          color: #6B7280;
          padding-top: 15px;
          border-top: 1px solid #E5E7EB;
        ">
          <div>Registered on: ${currentDate}</div>
          <div style="margin-top: 4px;">PT AJINOMOTO INDONESIA</div>
        </div>
      </div>
    `;
    
    printJS({
      printable: printContent,
      type: 'raw-html',
      style: `
        @page {
          size: 80mm 100mm;
          margin: 0;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
        }
      `,
      targetStyles: ['*'],
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
            className="w-full sm:w-auto"
          >
            Print Label RFID
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
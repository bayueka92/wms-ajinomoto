import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Truck, PlusCircle, Search, Filter, ArrowDownUp } from 'lucide-react';
import { GoodsEntryForm } from '../components/inventory/GoodsEntryForm';
import { format } from 'date-fns';

const BarangMasuk: React.FC = () => {
  const { movements, products } = useRFIDStore();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter only incoming movements
  const incomingMovements = movements.filter(
    (movement) => movement.type === 'in'
  );
  
  // Filter by search term if provided
  const filteredMovements = searchTerm
    ? incomingMovements.filter((movement) => {
        const product = products.find((p) => p.id === movement.productId);
        return (
          product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : incomingMovements;
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Barang Masuk</h1>
          <p className="text-ajinomoto-gray-500">Kelola dan catat seluruh barang yang masuk ke gudang</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowEntryForm(true)}
        >
          Tambah Barang Masuk
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter dan Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Cari berdasarkan nama produk, SKU, atau ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} />}
                fullWidth
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" leftIcon={<Filter size={16} />}>
                Filter
              </Button>
              
              <Button variant="outline" leftIcon={<ArrowDownUp size={16} />}>
                Urutkan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Barang Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {filteredMovements.length > 0 ? (
                  filteredMovements.map((movement) => {
                    const product = products.find((p) => p.id === movement.productId);
                    
                    return (
                      <tr key={movement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ajinomoto-gray-900">
                          {movement.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                          {product ? (
                            <div>
                              <div>{product.name}</div>
                              <div className="text-xs text-ajinomoto-gray-500">{product.sku}</div>
                            </div>
                          ) : (
                            'Unknown Product'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                          {movement.toLocationId || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                          {format(movement.timestamp, 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            movement.status === 'completed' ? 'bg-green-100 text-green-800' :
                            movement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            movement.status === 'cancelled' ? 'bg-ajinomoto-gray-100 text-ajinomoto-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {movement.status === 'completed' ? 'Selesai' :
                             movement.status === 'pending' ? 'Tertunda' :
                             movement.status === 'cancelled' ? 'Dibatalkan' :
                             'Gagal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-500 text-center">
                      Tidak ada data barang masuk
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <GoodsEntryForm
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
      />
    </div>
  );
};

export default BarangMasuk;
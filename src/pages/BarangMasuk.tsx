import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CustomSelect } from '../components/ui/Select';
import { CustomDatePicker } from '../components/ui/DatePicker';
import { Truck, PlusCircle, Search, Filter, ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';
import { GoodsEntryForm } from '../components/inventory/GoodsEntryForm';
import { format } from 'date-fns';
import { Modal } from '../components/ui/Modal';

interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string;
  location: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const BarangMasuk: React.FC = () => {
  const { movements, products } = useRFIDStore();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: null,
      end: null,
    },
    status: '',
    location: '',
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'timestamp',
    direction: 'desc',
  });
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter only incoming movements
  const incomingMovements = movements.filter(
    (movement) => movement.type === 'in'
  );

  // Apply filters and search
  const filteredMovements = incomingMovements.filter((movement) => {
    const product = products.find((p) => p.id === movement.productId);
    const matchesSearch = searchTerm
      ? product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesDateRange =
      (!filters.dateRange.start ||
        movement.timestamp >= filters.dateRange.start) &&
      (!filters.dateRange.end || movement.timestamp <= filters.dateRange.end);

    const matchesStatus = !filters.status || movement.status === filters.status;

    const matchesLocation =
      !filters.location || movement.toLocationId === filters.location;

    return matchesSearch && matchesDateRange && matchesStatus && matchesLocation;
  });

  // Sort movements
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    let comparison = 0;
    switch (sortConfig.key) {
      case 'timestamp':
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterApply = () => {
    setShowFilterModal(false);
  };

  const handleFilterReset = () => {
    setFilters({
      dateRange: {
        start: null,
        end: null,
      },
      status: '',
      location: '',
    });
  };

  const statusOptions = [
    { value: 'completed', label: 'Selesai' },
    { value: 'pending', label: 'Tertunda' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'failed', label: 'Gagal' },
  ];

  const locationOptions = [
    { value: 'rack-a-1', label: 'Rack A-1' },
    { value: 'rack-a-2', label: 'Rack A-2' },
    { value: 'rack-b-1', label: 'Rack B-1' },
    { value: 'rack-b-2', label: 'Rack B-2' },
  ];

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
              <Button
                variant="outline"
                leftIcon={<Filter size={16} />}
                onClick={() => setShowFilterModal(true)}
              >
                Filter
              </Button>
              
              <Button
                variant="outline"
                leftIcon={<ArrowUpDown size={16} />}
                onClick={() => handleSort('timestamp')}
              >
                {sortConfig.key === 'timestamp'
                  ? `Sort ${sortConfig.direction === 'asc' ? '↑' : '↓'}`
                  : 'Sort'}
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
                    No
                  </th>
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
                {sortedMovements.length > 0 ? (
                  sortedMovements.map((movement, index) => {
                    const product = products.find((p) => p.id === movement.productId);
                    
                    return (
                      <tr key={movement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-500">
                          {index + 1}
                        </td>
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
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Eye size={14} />}
                              onClick={() => {
                                setSelectedMovement(movement.id);
                                setShowDetailModal(true);
                              }}
                            >
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Edit size={14} />}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={<Trash2 size={14} />}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-500 text-center">
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

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Barang Masuk"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rentang Waktu</h4>
            <div className="grid grid-cols-2 gap-4">
              <CustomDatePicker
                label="Dari"
                value={filters.dateRange.start}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: date },
                  }))
                }
              />
              <CustomDatePicker
                label="Sampai"
                value={filters.dateRange.end}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: date },
                  }))
                }
              />
            </div>
          </div>

          <CustomSelect
            label="Status"
            value={statusOptions.find((opt) => opt.value === filters.status)}
            onChange={(option: any) =>
              setFilters((prev) => ({ ...prev, status: option?.value || '' }))
            }
            options={statusOptions}
            isClearable
          />

          <CustomSelect
            label="Lokasi"
            value={locationOptions.find((opt) => opt.value === filters.location)}
            onChange={(option: any) =>
              setFilters((prev) => ({ ...prev, location: option?.value || '' }))
            }
            options={locationOptions}
            isClearable
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleFilterReset}>
              Reset
            </Button>
            <Button variant="primary" onClick={handleFilterApply}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Barang Masuk"
      >
        {selectedMovement && (
          <div className="space-y-4">
            {/* Add detailed movement information here */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-ajinomoto-gray-500">ID Transaksi</h4>
                <p className="text-ajinomoto-gray-900">{selectedMovement}</p>
              </div>
              {/* Add more details */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BarangMasuk;
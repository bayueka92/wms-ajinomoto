import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CustomSelect } from '../components/ui/Select';
import { CustomDatePicker } from '../components/ui/DatePicker';
import { Truck, PlusCircle, Search, Filter, ArrowUpDown, Eye, Edit, Trash2, QrCode, Printer } from 'lucide-react';
import { GoodsEntryForm } from '../components/inventory/GoodsEntryForm';
import { format } from 'date-fns';
import { Modal } from '../components/ui/Modal';
import Swal from 'sweetalert2';
import printJS from 'print-js';

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
  const { movements, products, deleteMovement, updateMovement } = useRFIDStore();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    quantity: '',
    location: '',
    notes: '',
    status: '',
  });
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
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (movementId: string) => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data barang masuk yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E61E25',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await deleteMovement(movementId);
      Swal.fire(
        'Terhapus!',
        'Data barang masuk berhasil dihapus.',
        'success'
      );
    }
  };

  const handleEdit = async () => {
    if (!selectedMovement) return;

    try {
      await updateMovement(selectedMovement, editForm);
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data barang masuk berhasil diperbarui',
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat memperbarui data',
      });
    }
  };

  const handlePrintRFIDLabel = (movement: any) => {
    const product = products.find(p => p.id === movement.productId);
    if (!product) return;

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
          ">${movement.rfidTagId}</div>
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
                ${product.name}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">SKU</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right; font-family: monospace;">
                ${product.sku}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Category</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right;">
                ${product.category}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Batch</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right; font-family: monospace;">
                ${product.batchNumber || 'N/A'}
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6B7280;">Location</td>
              <td style="padding: 4px 0; color: #1F2937; text-align: right;">
                ${movement.toLocationId || 'N/A'}
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-ajinomoto-gray-100 text-ajinomoto-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

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

              <Button variant="outline" leftIcon={<ArrowUpDown size={16} />}>
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
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(movement.status)}`}>
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
                              onClick={() => {
                                setSelectedMovement(movement.id);
                                setEditForm({
                                  quantity: movement.quantity.toString(),
                                  location: movement.toLocationId || '',
                                  notes: movement.notes || '',
                                  status: movement.status,
                                });
                                setShowEditModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={<Trash2 size={14} />}
                              onClick={() => handleDelete(movement.id)}
                            >
                              Hapus
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Printer size={14} />}
                              onClick={() => handlePrintRFIDLabel(movement)}
                            >
                              Print RFID
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
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  dateRange: { start: null, end: null },
                  status: '',
                  location: '',
                });
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowFilterModal(false)}
            >
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
        size="lg"
      >
        {selectedMovement && (() => {
          const movement = movements.find(m => m.id === selectedMovement);
          const product = movement ? products.find(p => p.id === movement.productId) : null;

          if (!movement || !product) return null;

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">ID Transaksi</h4>
                    <p className="text-ajinomoto-gray-900 font-mono">{movement.id}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">Waktu</h4>
                    <p className="text-ajinomoto-gray-900">{format(movement.timestamp, 'dd MMMM yyyy HH:mm:ss')}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">Status</h4>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(movement.status)}`}>
                      {movement.status === 'completed' ? 'Selesai' :
                       movement.status === 'pending' ? 'Tertunda' :
                       movement.status === 'cancelled' ? 'Dibatalkan' :
                       'Gagal'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">Produk</h4>
                    <p className="text-ajinomoto-gray-900">{product.name}</p>
                    <p className="text-sm text-ajinomoto-gray-500">{product.sku}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">Jumlah</h4>
                    <p className="text-ajinomoto-gray-900">{movement.quantity} unit</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-ajinomoto-gray-500">Lokasi</h4>
                    <p className="text-ajinomoto-gray-900">{movement.toLocationId || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-ajinomoto-gray-200 pt-4">
                <h4 className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Detail Produk</h4>
                <div className="bg-ajinomoto-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-ajinomoto-gray-500">Kategori</p>
                      <p className="text-ajinomoto-gray-900">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-ajinomoto-gray-500">Berat</p>
                      <p className="text-ajinomoto-gray-900">{product.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-ajinomoto-gray-500">Dimensi</p>
                      <p className="text-ajinomoto-gray-900">
                        {product.dimensions.length}cm × {product.dimensions.width}cm × {product.dimensions.height}cm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ajinomoto-gray-500">Batch</p>
                      <p className="text-ajinomoto-gray-900">{product.batchNumber || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {movement.notes && (
                <div className="border-t border-ajinomoto-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Catatan</h4>
                  <p className="text-ajinomoto-gray-700">{movement.notes}</p>
                </div>
              )}

              <div className="border-t border-ajinomoto-gray-200 pt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Printer size={16} />}
                  onClick={() => handlePrintRFIDLabel(movement)}
                >
                  Print Label RFID
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Barang Masuk"
      >
        <div className="space-y-4">
          <Input
            label="Jumlah"
            type="number"
            value={editForm.quantity}
            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
            fullWidth
          />

          <CustomSelect
            label="Lokasi"
            value={locationOptions.find((opt) => opt.value === editForm.location)}
            onChange={(option: any) =>
              setEditForm({ ...editForm, location: option?.value || '' })
            }
            options={locationOptions}
            isClearable
          />

          <CustomSelect
            label="Status"
            value={statusOptions.find((opt) => opt.value === editForm.status)}
            onChange={(option: any) =>
              setEditForm({ ...editForm, status: option?.value || '' })
            }
            options={statusOptions}
          />

          <Input
            label="Catatan"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BarangMasuk;
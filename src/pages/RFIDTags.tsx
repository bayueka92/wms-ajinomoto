import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Printer
} from 'lucide-react';
import { RFIDRegistrationForm } from '../components/rfid/RFIDRegistrationForm';
import { format } from 'date-fns';

const RFIDTags: React.FC = () => {
  const { rfidTags, products } = useRFIDStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredTags = searchTerm
    ? rfidTags.filter((tag) => {
        const product = products.find((p) => p.id === tag.productId);
        return (
          tag.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : rfidTags;

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const currentTags = filteredTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">RFID Tags</h1>
          <p className="text-ajinomoto-gray-500">Kelola dan monitor seluruh RFID tag dalam sistem</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowRegistrationForm(true)}
        >
          Daftarkan Tag Baru
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
                placeholder="Cari berdasarkan Tag ID, nama produk, atau SKU"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset ke halaman 1 jika mencari
                }}
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
          <CardTitle>Daftar RFID Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">NO</th>
                  <th className="px-6 py-3">Tag ID</th>
                  <th className="px-6 py-3">Produk</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Lokasi</th>
                  <th className="px-6 py-3">Terakhir Dipindai</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {currentTags.map((tag, index) => {
                  const product = products.find((p) => p.id === tag.productId);
                  return (
                    <tr key={tag.id}>
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-mono">{tag.tagId}</td>
                      <td className="px-6 py-4">
                        {product ? (
                          <>
                            <div>{product.name}</div>
                            <div className="text-xs text-ajinomoto-gray-500">{product.sku}</div>
                          </>
                        ) : (
                          'Unknown Product'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          tag.status === 'active' ? 'bg-green-100 text-green-800' :
                          tag.status === 'inactive' ? 'bg-ajinomoto-gray-100 text-ajinomoto-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tag.status === 'active' ? 'Aktif' :
                          tag.status === 'inactive' ? 'Tidak Aktif' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{tag.locationId || '-'}</td>
                      <td className="px-6 py-4">
                        {tag.lastScan ? (
                          <>
                            <div>{tag.lastScan.location}</div>
                            <div className="text-xs text-ajinomoto-gray-500">
                              {format(new Date(tag.lastScan.timestamp), 'dd/MM/yyyy HH:mm')}
                            </div>
                          </>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" leftIcon={<Printer size={14} />}>
                            Print
                          </Button>
                          <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />}>
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-ajinomoto-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Registrasi RFID Tag Baru</h2>
              <RFIDRegistrationForm onComplete={() => setShowRegistrationForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFIDTags;

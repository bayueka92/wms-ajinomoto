import React, { useState } from 'react';
import { useWarehouseStore } from '../store/warehouseStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Filter, Plus, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Lokasi: React.FC = () => {
  const { locations } = useWarehouseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const filteredLocations = searchTerm
    ? locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : locations;

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  // Fungsi untuk render tombol halaman, supaya tidak terlalu banyak bisa dibatasi range halaman yang ditampilkan
  const renderPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 20; // maksimal tombol halaman yang tampil

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1 rounded-md border ${
            i === currentPage
              ? 'bg-ajinomoto-primary text-white border-ajinomoto-primary'
              : 'bg-white text-ajinomoto-gray-700 border-ajinomoto-gray-300 hover:bg-ajinomoto-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container mx-auto">
      {/* Header dan Filter */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Lokasi</h1>
          <p className="text-ajinomoto-gray-500">Kelola lokasi dan area penyimpanan di gudang</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowLocationForm(true)}
        >
          Tambah Lokasi
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
                placeholder="Cari berdasarkan nama atau kode lokasi"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset page saat cari
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Lokasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">NO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Kapasitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Terisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Dimensi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {paginatedLocations.map((location, index) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ajinomoto-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ajinomoto-gray-900">
                      {location.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {location.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {location.type === 'rack' ? 'Rak' :
                       location.type === 'aisle' ? 'Lorong' :
                       location.type === 'zone' ? 'Zona' :
                       location.type === 'staging' ? 'Area Staging' :
                       location.type === 'receiving' ? 'Area Penerimaan' :
                       'Area Pengiriman'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {location.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 mr-2">
                          <div className="h-2 bg-ajinomoto-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                (location.occupied / location.capacity) < 0.7
                                  ? 'bg-success'
                                  : (location.occupied / location.capacity) < 0.9
                                  ? 'bg-warning'
                                  : 'bg-error'
                              }`}
                              style={{
                                width: `${(location.occupied / location.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm">
                          {Math.round((location.occupied / location.capacity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {location.width}m × {location.height}m × {location.depth}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>Edit</Button>
                        <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft size={16} />}
              >
                Prev
              </Button>

              {renderPageNumbers()}

              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Lokasi;

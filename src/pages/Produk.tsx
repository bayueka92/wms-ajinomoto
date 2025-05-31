import React, { useState } from 'react';
import { useRFIDStore } from '../store/rfidStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Box, PlusCircle, Search, Filter, ArrowUpDown, Edit, Trash2, QrCode } from 'lucide-react';
import { format } from 'date-fns';

// ... [imports tetap sama]
const Produk: React.FC = () => {
  const { products } = useRFIDStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Produk</h1>
          <p className="text-ajinomoto-gray-500">Kelola data produk dan informasi inventaris</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowProductForm(true)}
        >
          Tambah Produk
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
                placeholder="Cari berdasarkan nama, SKU, atau kategori"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<Search size={16} />}
                fullWidth
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" leftIcon={<Filter size={16} />}>Filter</Button>
              <Button variant="outline" leftIcon={<ArrowUpDown size={16} />}>Urutkan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Nama Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Dimensi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Kadaluarsa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {currentProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4 text-sm text-ajinomoto-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-ajinomoto-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                      <div>
                        <div>{product.name}</div>
                        <div className="text-xs text-ajinomoto-gray-500">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                      {product.dimensions.length}cm × {product.dimensions.width}cm × {product.dimensions.height}cm
                    </td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">{product.batchNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                      {product.expiryDate ? format(new Date(product.expiryDate), 'dd/MM/yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" leftIcon={<QrCode size={14} />}>RFID</Button>
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
    </div>
  );
};

export default Produk;


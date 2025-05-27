import React, { useState } from 'react';
import { useWarehouseStore } from '../store/warehouseStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Filter, Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';

const Lokasi: React.FC = () => {
  const { locations } = useWarehouseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);

  const filteredLocations = searchTerm
    ? locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : locations;

  return (
    <div className="container mx-auto">
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
          <CardTitle>Daftar Lokasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Terisi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Dimensi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {filteredLocations.map((location) => (
                  <tr key={location.id}>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lokasi;
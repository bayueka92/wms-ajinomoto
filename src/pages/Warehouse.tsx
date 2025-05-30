import React, { useState } from 'react';
import { useWarehouseStore } from '../store/warehouseStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { WarehouseVisualization } from '../components/warehouse/WarehouseVisualization';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

const Warehouse: React.FC = () => {
  const { locations, selectedLocation } = useWarehouseStore();
  const [showLocationForm, setShowLocationForm] = useState(false);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Warehouse Lokasi Rack</h1>
          <p className="text-ajinomoto-gray-500">Lokasi rack dan monitoring gudang secara real-time</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowLocationForm(true)}
        >
          Tambah Lokasi
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rack Gudang</CardTitle>
            </CardHeader>
            <CardContent>
              <WarehouseVisualization />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detail Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-ajinomoto-gray-900">{selectedLocation.name}</h3>
                    <p className="text-sm text-ajinomoto-gray-500">{selectedLocation.code}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-ajinomoto-gray-500">Tipe</p>
                      <p className="text-ajinomoto-gray-900">
                        {selectedLocation.type === 'rack' ? 'Rak' :
                         selectedLocation.type === 'aisle' ? 'Lorong' :
                         selectedLocation.type === 'zone' ? 'Zona' :
                         selectedLocation.type === 'staging' ? 'Area Staging' :
                         selectedLocation.type === 'receiving' ? 'Area Penerimaan' :
                         'Area Pengiriman'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-ajinomoto-gray-500">Kapasitas</p>
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <div className="h-2 bg-ajinomoto-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                (selectedLocation.occupied / selectedLocation.capacity) < 0.7
                                  ? 'bg-success'
                                  : (selectedLocation.occupied / selectedLocation.capacity) < 0.9
                                  ? 'bg-warning'
                                  : 'bg-error'
                              }`}
                              style={{
                                width: `${(selectedLocation.occupied / selectedLocation.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round((selectedLocation.occupied / selectedLocation.capacity) * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-ajinomoto-gray-500 mt-1">
                        {selectedLocation.occupied} dari {selectedLocation.capacity} unit
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-ajinomoto-gray-500">Dimensi</p>
                      <p className="text-ajinomoto-gray-900">
                        {selectedLocation.width}m × {selectedLocation.height}m × {selectedLocation.depth}m
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-ajinomoto-gray-500">Koordinat</p>
                      <p className="text-ajinomoto-gray-900 font-mono">
                        X: {selectedLocation.x}, Y: {selectedLocation.y}, Z: {selectedLocation.z}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-ajinomoto-gray-200 mt-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye size={14} />}
                        >
                          Lihat Detail
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
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-ajinomoto-gray-500">
                    Pilih lokasi pada menu view untuk melihat detail
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
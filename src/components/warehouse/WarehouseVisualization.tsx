import React, { useState } from 'react';
import { useWarehouseStore } from '../../store/warehouseStore';
import { Button } from '../ui/Button';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import Swal from 'sweetalert2';

export const WarehouseVisualization: React.FC = () => {
  const { locations, selectedLocation, deleteLocation, updateLocation } = useWarehouseStore();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    capacity: 0,
    width: 0,
    height: 0,
    depth: 0
  });

  const handleDelete = (locationId: string) => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Lokasi yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E61E25',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLocation(locationId);
        Swal.fire(
          'Terhapus!',
          'Lokasi berhasil dihapus.',
          'success'
        );
      }
    });
  };

  const handleEdit = (location: any) => {
    setEditForm({
      name: location.name,
      code: location.code,
      capacity: location.capacity,
      width: location.width,
      height: location.height,
      depth: location.depth
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (selectedLocation) {
      await updateLocation(selectedLocation.id, editForm);
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data lokasi berhasil diperbarui',
        timer: 1500
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <div
          key={location.id}
          className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
            selectedLocation?.id === location.id
              ? 'border-ajinomoto-red bg-ajinomoto-red-50'
              : 'border-ajinomoto-gray-200 hover:border-ajinomoto-red'
          }`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-ajinomoto-gray-900">{location.name}</h3>
              <p className="text-sm text-ajinomoto-gray-500">{location.code}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ajinomoto-gray-500">Kapasitas:</span>
                <span>{location.capacity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ajinomoto-gray-500">Terisi:</span>
                <span>{location.occupied}</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-ajinomoto-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
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
            </div>

            <div className="pt-4 mt-4 border-t border-ajinomoto-gray-200">
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye size={14} />}
                  onClick={() => setShowDetailModal(true)}
                  className="w-full justify-center hover:bg-ajinomoto-red hover:text-white"
                >
                  Lihat Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit size={14} />}
                  onClick={() => handleEdit(location)}
                  className="w-full justify-center hover:bg-ajinomoto-blue hover:text-white"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => handleDelete(location.id)}
                  className="w-full justify-center hover:bg-error hover:text-white"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Lokasi"
        size="lg"
      >
        {selectedLocation && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-ajinomoto-gray-500">Nama Lokasi</h4>
                <p className="text-ajinomoto-gray-900">{selectedLocation.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-ajinomoto-gray-500">Kode</h4>
                <p className="text-ajinomoto-gray-900">{selectedLocation.code}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Utilisasi</h4>
              <div className="w-full bg-ajinomoto-gray-200 rounded-full h-2 mb-1">
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
              <p className="text-sm text-ajinomoto-gray-500">
                {selectedLocation.occupied} dari {selectedLocation.capacity} unit ({Math.round((selectedLocation.occupied / selectedLocation.capacity) * 100)}% terisi)
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Dimensi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">Panjang</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.width}m</p>
                </div>
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">Lebar</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.depth}m</p>
                </div>
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">Tinggi</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.height}m</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-ajinomoto-gray-500 mb-2">Koordinat</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">X</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.x}</p>
                </div>
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">Y</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.y}</p>
                </div>
                <div>
                  <p className="text-sm text-ajinomoto-gray-500">Z</p>
                  <p className="text-ajinomoto-gray-900">{selectedLocation.z}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-ajinomoto-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto"
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedLocation);
                }}
                className="w-full sm:w-auto"
              >
                Edit Lokasi
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lokasi"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nama Lokasi"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            fullWidth
          />
          <Input
            label="Kode"
            value={editForm.code}
            onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
            fullWidth
          />
          <Input
            label="Kapasitas"
            type="number"
            value={editForm.capacity}
            onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
            fullWidth
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Panjang (m)"
              type="number"
              value={editForm.width}
              onChange={(e) => setEditForm({ ...editForm, width: parseFloat(e.target.value) })}
              fullWidth
            />
            <Input
              label="Lebar (m)"
              type="number"
              value={editForm.depth}
              onChange={(e) => setEditForm({ ...editForm, depth: parseFloat(e.target.value) })}
              fullWidth
            />
            <Input
              label="Tinggi (m)"
              type="number"
              value={editForm.height}
              onChange={(e) => setEditForm({ ...editForm, height: parseFloat(e.target.value) })}
              fullWidth
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
              className="w-full sm:w-auto"
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
import React, { useState } from "react";
import { useRFIDStore } from "../store/rfidStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  ShoppingCart,
  PlusCircle,
  Search,
  Filter,
  ArrowDownUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { GoodsExitForm } from "../components/inventory/GoodsExitForm";
import { format } from "date-fns";

const BarangKeluar: React.FC = () => {
  const { movements, products } = useRFIDStore();
  const [showExitForm, setShowExitForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const outgoingMovements = movements.filter((m) => m.type === "out");

  const filteredMovements = searchTerm
    ? outgoingMovements.filter((movement) => {
        const product = products.find((p) => p.id === movement.productId);
        return (
          product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : outgoingMovements;

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Barang Keluar</h1>
          <p className="text-ajinomoto-gray-500">
            Kelola dan catat seluruh barang yang keluar dari gudang
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowExitForm(true)}
        >
          Tambah Barang Keluar
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
              <Button variant="outline" leftIcon={<ArrowDownUp size={16} />}>Urutkan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Barang Keluar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Dari Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {paginatedMovements.length > 0 ? (
                  paginatedMovements.map((movement, index) => {
                    const product = products.find((p) => p.id === movement.productId);
                    return (
                      <tr key={movement.id}>
                        <td className="px-4 py-4 text-sm text-ajinomoto-gray-700">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-ajinomoto-gray-900">
                          {movement.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                          {product ? (
                            <div>
                              <div>{product.name}</div>
                              <div className="text-xs text-ajinomoto-gray-500">{product.sku}</div>
                            </div>
                          ) : "Unknown Product"}
                        </td>
                        <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">{movement.quantity}</td>
                        <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">{movement.fromLocationId || "-"}</td>
                        <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                          {format(new Date(movement.timestamp), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            movement.status === "completed" ? "bg-green-100 text-green-800" :
                            movement.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            movement.status === "cancelled" ? "bg-ajinomoto-gray-100 text-ajinomoto-gray-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {movement.status === "completed" ? "Selesai" :
                             movement.status === "pending" ? "Tertunda" :
                             movement.status === "cancelled" ? "Dibatalkan" :
                             "Gagal"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-ajinomoto-gray-700">
                          <Button variant="outline" size="sm">Detail</Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-ajinomoto-gray-500">
                      Tidak ada data barang keluar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft size={16} />}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-ajinomoto-gray-600">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight size={16} />}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <GoodsExitForm isOpen={showExitForm} onClose={() => setShowExitForm(false)} />
    </div>
  );
};

export default BarangKeluar;

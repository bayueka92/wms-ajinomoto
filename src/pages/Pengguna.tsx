import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, PlusCircle, Search, Filter, ArrowUpDown, Edit, Trash2, Key } from 'lucide-react';

const Pengguna: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);

  // Mock users data for demonstration
  const users = [
    {
      id: '1',
      username: 'admin',
      name: 'Admin Utama',
      role: 'admin',
      email: 'admin@ajinomoto.co.id',
      lastLogin: new Date(),
      status: 'active',
    },
    {
      id: '2',
      username: 'warehouse1',
      name: 'Petugas Gudang 1',
      role: 'warehouse',
      email: 'warehouse1@ajinomoto.co.id',
      lastLogin: new Date(Date.now() - 86400000),
      status: 'active',
    },
    {
      id: '3',
      username: 'supervisor1',
      name: 'Supervisor Gudang',
      role: 'supervisor',
      email: 'supervisor1@ajinomoto.co.id',
      lastLogin: new Date(Date.now() - 172800000),
      status: 'active',
    },
  ];

  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Pengguna</h1>
          <p className="text-ajinomoto-gray-500">Kelola akun pengguna dan hak akses sistem</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowUserForm(true)}
        >
          Tambah Pengguna
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
                placeholder="Cari berdasarkan nama, username, atau email"
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
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ajinomoto-gray-200">
              <thead className="bg-ajinomoto-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Login Terakhir
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ajinomoto-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ajinomoto-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ajinomoto-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' :
                         user.role === 'supervisor' ? 'Supervisor' :
                         'Petugas Gudang'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      {user.lastLogin.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ajinomoto-gray-700">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Key size={14} />}
                        >
                          Reset Password
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pengguna;
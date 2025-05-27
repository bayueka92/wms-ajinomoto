import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Printer, Filter, Calendar } from 'lucide-react';

const Laporan: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-02-01',
    end: '2024-02-29',
  });

  // Mock data for charts
  const movementData = [
    { date: '01/02', in: 150, out: 120 },
    { date: '02/02', in: 180, out: 150 },
    { date: '03/02', in: 200, out: 180 },
    { date: '04/02', in: 220, out: 200 },
    { date: '05/02', in: 190, out: 170 },
    { date: '06/02', in: 230, out: 210 },
    { date: '07/02', in: 210, out: 190 },
  ];

  const stockData = [
    { name: 'MSG 1kg', value: 400 },
    { name: 'MSG 500g', value: 300 },
    { name: 'MSG 250g', value: 200 },
    { name: 'MSG 100g', value: 100 },
  ];

  const COLORS = ['#E61E25', '#1E3A8A', '#10B981', '#F59E0B'];

  const utilizationData = [
    { date: '01/02', value: 75 },
    { date: '02/02', value: 78 },
    { date: '03/02', value: 82 },
    { date: '04/02', value: 85 },
    { date: '05/02', value: 80 },
    { date: '06/02', value: 83 },
    { date: '07/02', value: 87 },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ajinomoto-gray-900">Laporan</h1>
          <p className="text-ajinomoto-gray-500">Analisis dan laporan performa gudang</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            leftIcon={<Printer size={16} />}
          >
            Print
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                label="Tanggal Mulai"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                fullWidth
                leftIcon={<Calendar size={16} />}
              />
            </div>

            <div className="w-full md:w-1/3">
              <Input
                label="Tanggal Selesai"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                fullWidth
                leftIcon={<Calendar size={16} />}
              />
            </div>

            <div className="w-full md:w-1/3 flex items-end">
              <Button
                variant="primary"
                leftIcon={<Filter size={16} />}
                fullWidth
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Pergerakan Barang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="in" name="Barang Masuk" fill="#10B981" />
                  <Bar dataKey="out" name="Barang Keluar" fill="#E61E25" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Stok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Utilisasi Gudang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  name="Utilisasi (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Laporan Harian</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan Pergerakan
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan Stok
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan RFID
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Laporan Mingguan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Analisis Tren
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan Kinerja
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan Utilisasi
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText size={20} className="mr-2 text-ajinomoto-gray-500" />
              <CardTitle>Laporan Bulanan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Ringkasan Eksekutif
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Laporan Keuangan
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
                Analisis Performa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Laporan;
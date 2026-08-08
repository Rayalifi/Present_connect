import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Search,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Radio,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { attendanceService } from '../../services/attendanceService';
import { exportAttendanceToCsv } from '../../utils/exportCsv';
import { formatDateIndo, formatTimeIndo } from '../../utils/dateFormatter';
import { DEPARTMENTS, GENERATIONS } from '../../utils/constants';

export function AttendanceHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('all');
  const [generation, setGeneration] = useState('all');
  const [status, setStatus] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getHistory({
        search,
        startDate,
        endDate,
        department,
        generation,
        status
      });
      setHistory(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [department, generation, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleExportCsv = () => {
    exportAttendanceToCsv(history, `riwayat_absensi_himatif_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
  const paginatedData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            Riwayat Absensi RFID
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log lengkap ketukan kartu RFID anggota, filter rentang tanggal, dan ekspor laporan CSV.
          </p>
        </div>

        <Button
          variant="success"
          size="md"
          onClick={handleExportCsv}
          disabled={history.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama, NIM, UID..."
              icon={Search}
            />
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'all', label: 'Semua Dept' },
                ...DEPARTMENTS.map((d) => ({ value: d, label: d }))
              ]}
            />
          </div>

          {/* Search Button */}
          <div>
            <Button type="submit" variant="secondary" size="md" className="w-full">
              <Search className="w-4 h-4" />
              <span>Terapkan</span>
            </Button>
          </div>
        </form>
      </div>

      {/* History Data Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <LoadingSpinner text="Memuat riwayat absensi..." size="md" className="py-16" />
        ) : history.length === 0 ? (
          <EmptyState
            icon={History}
            title="Tidak Ada Riwayat Absensi"
            description="Belum ada transaksi presensi yang cocok dengan kriteria filter."
          />
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tanggal</th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Nama Lengkap</th>
                    <th className="py-3.5 px-4">NIM</th>
                    <th className="py-3.5 px-4">Angkatan</th>
                    <th className="py-3.5 px-4">Departemen</th>
                    <th className="py-3.5 px-4">UID RFID</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-200">
                        {formatDateIndo(item.attendance_date)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {formatTimeIndo(item.attendance_time)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.nim}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.generation}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.department}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {item.uid_rfid}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success" size="sm">
                          {item.status || 'Hadir'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
              <span>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, history.length)} dari {history.length} data
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-white font-bold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

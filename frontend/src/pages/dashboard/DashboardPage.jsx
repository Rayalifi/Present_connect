import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Percent, Radio, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { AttendanceChart } from '../../components/dashboard/AttendanceChart';
import { RecentAttendanceList } from '../../components/dashboard/RecentAttendanceList';
import { MemberIdentityCard } from '../../components/attendance/MemberIdentityCard';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { attendanceService } from '../../services/attendanceService';
import { useSocket } from '../../context/SocketContext';
import { formatDateIndo, formatTimeIndo } from '../../utils/dateFormatter';

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  const { socket, latestScan } = useSocket();

  const fetchDashboardData = async () => {
    try {
      const res = await attendanceService.getDashboardSummary();
      if (res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for realtime attendance events
  useEffect(() => {
    if (latestScan && latestScan.success && latestScan.member) {
      // Refresh dashboard stats on new scan
      fetchDashboardData();
    }
  }, [latestScan]);

  if (loading) {
    return <LoadingSpinner text="Memuat ringkasan dashboard HIMATIF Connect..." size="lg" className="py-20" />;
  }

  const stats = summary?.stats || {
    totalMembers: 6,
    presentToday: 3,
    notPresentToday: 3,
    totalAllTime: 12,
    attendanceRate: 50
  };

  const recentScans = summary?.recentScans || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Sistem Presensi RFID Terhubung
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang di HIMATIF Connect
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Pantau kehadiran anggota pengurus dan rekapitulasi data absensi berbasis RFID ESP32 secara realtime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Buka Layar Absensi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Anggota"
          value={stats.totalMembers}
          subtitle="Anggota aktif terdaftar"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Hadir Hari Ini"
          value={stats.presentToday}
          subtitle={`Dari total ${stats.totalMembers} anggota`}
          icon={UserCheck}
          color="emerald"
        />

        <StatCard
          title="Belum Hadir"
          value={stats.notPresentToday}
          subtitle="Belum melakukan tap RFID"
          icon={UserX}
          color="amber"
        />

        <StatCard
          title="Tingkat Kehadiran"
          value={`${stats.attendanceRate}%`}
          subtitle={`Total ${stats.totalAllTime} riwayat tercatat`}
          icon={Percent}
          color="cyan"
        />
      </div>

      {/* Main Grid: Weekly Chart & Recent Scans Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        <div className="lg:col-span-1">
          <RecentAttendanceList
            scans={recentScans}
            onSelectMember={(scan) => setSelectedMember(scan)}
          />
        </div>
      </div>

      {/* Modal Quick View Member Identity Card */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title="Kartu Pengenal Anggota"
        subtitle="Detail kartu anggota terpilih"
      >
        {selectedMember && (
          <div className="flex justify-center py-2">
            <MemberIdentityCard
              member={{
                name: selectedMember.name || selectedMember.member_name,
                nim: selectedMember.nim,
                generation: selectedMember.generation,
                department: selectedMember.department,
                photo: selectedMember.photo,
                uid_rfid: selectedMember.uid_rfid
              }}
              attendance={{
                date: selectedMember.attendance_date,
                time: selectedMember.attendance_time
              }}
              statusText="HADIR HARI INI"
              statusVariant="success"
              size="md"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

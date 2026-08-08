import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, Calendar, CheckCircle2, ShieldCheck, Radio, User } from 'lucide-react';
import { MemberIdentityCard } from '../../components/attendance/MemberIdentityCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { memberService } from '../../services/memberService';
import { formatDateIndo, formatTimeIndo } from '../../utils/dateFormatter';

export function MemberDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await memberService.getById(id);
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Memuat detail anggota..." size="lg" className="py-20" />;
  }

  if (!data || !data.member) {
    return (
      <EmptyState
        title="Anggota Tidak Ditemukan"
        description="Data anggota yang Anda tuju tidak tersedia atau telah dihapus."
        actionLabel="Kembali ke Daftar"
        onAction={() => window.location.href = '/members'}
      />
    );
  }

  const { member, stats, attendanceHistory = [] } = data;

  return (
    <div className="space-y-6">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            to="/members"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Anggota</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Profil & Kartu ID Anggota
          </h2>
        </div>

        <Link to={`/members/${id}/edit`}>
          <Button variant="secondary" size="md">
            <Edit className="w-4 h-4" />
            <span>Edit Profil Anggota</span>
          </Button>
        </Link>
      </div>

      {/* Grid: Left ID Card, Right Stats & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Reusable Digital ID Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <MemberIdentityCard
            member={member}
            attendance={attendanceHistory[0]}
            statusText={member.status === 'active' ? 'ANGGOTA AKTIF' : 'NON-AKTIF'}
            statusVariant={member.status === 'active' ? 'success' : 'neutral'}
            size="lg"
            showTimestamp={attendanceHistory.length > 0}
          />
        </div>

        {/* Right: Summary Stats & Attendance Log Table */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Kehadiran
              </span>
              <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                {stats?.totalAttendance || 0} <span className="text-xs text-slate-400 font-sans font-normal">kali hadir</span>
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Kehadiran Terakhir
              </span>
              <p className="text-xs font-semibold text-white mt-1">
                {attendanceHistory.length > 0
                  ? `${formatDateIndo(attendanceHistory[0].attendance_date)}`
                  : 'Belum pernah absensi'}
              </p>
            </div>
          </div>

          {/* Member's Attendance History Table */}
          <Card>
            <CardHeader
              title="Riwayat Presensi Anggota Ini"
              subtitle="Log riwayat ketukan RFID kartu milik anggota"
            />

            {attendanceHistory.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Belum Ada Riwayat"
                description="Anggota ini belum pernah melakukan absensi dengan kartu RFID."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Waktu</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {attendanceHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-slate-200">
                          {formatDateIndo(log.attendance_date)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400">
                          {formatTimeIndo(log.attendance_time)}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="success" size="sm">
                            {log.status || 'Hadir'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}

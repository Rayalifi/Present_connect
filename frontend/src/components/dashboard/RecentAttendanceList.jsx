import React from 'react';
import { Clock, UserCheck, ShieldCheck } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatTimeIndo } from '../../utils/dateFormatter';

export function RecentAttendanceList({ scans = [], onSelectMember }) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader
        title="Absensi Terbaru Hari Ini"
        subtitle="Anggota yang baru saja melakukan absensi RFID"
        action={
          <Badge variant="cyan" dot size="sm">
            Live Feed
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto max-h-80 space-y-2.5 pr-1">
        {scans.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Belum Ada Absensi"
            description="Belum ada anggota yang melakukan scan RFID hari ini."
          />
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id || `${scan.uid_rfid}-${scan.attendance_time}`}
              onClick={() => onSelectMember && onSelectMember(scan)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={scan.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                  alt={scan.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-500/50"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {scan.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {scan.nim} • {scan.department}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge variant="success" size="sm">
                  {scan.status || 'Hadir'}
                </Badge>
                <span className="block text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-end gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTimeIndo(scan.attendance_time)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

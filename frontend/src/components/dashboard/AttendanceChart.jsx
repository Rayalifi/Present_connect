import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';

export function AttendanceChart({
  data = [
    { day: 'Sen', count: 18, rate: 75 },
    { day: 'Sel', count: 22, rate: 91 },
    { day: 'Rab', count: 20, rate: 83 },
    { day: 'Kam', count: 24, rate: 100 },
    { day: 'Jum', count: 19, rate: 79 },
    { day: 'Sab', count: 15, rate: 62 },
    { day: 'Min', count: 12, rate: 50 }
  ]
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader
        title="Statistik Kehadiran Mingguan"
        subtitle="Tren absensi anggota HIMATIF 7 hari terakhir"
        action={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-400 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Aktif</span>
          </div>
        }
      />

      {/* SVG-based Dynamic Bar Chart */}
      <div className="mt-4 flex items-end justify-between gap-2 sm:gap-4 h-48 pt-6 pb-2 px-2">
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded-md border border-cyan-500/30 whitespace-nowrap shadow-lg -translate-y-1">
                {item.count} Hadir ({item.rate}%)
              </div>

              {/* Bar */}
              <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-full relative">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 rounded-t-xl transition-all duration-700 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Rata-rata Kehadiran: <strong className="text-white">82%</strong></span>
        <span className="text-[11px] text-cyan-400 font-mono">Updated Realtime</span>
      </div>
    </Card>
  );
}

import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2, QrCode, Radio } from 'lucide-react';
import { formatDateIndo, formatTimeIndo } from '../../utils/dateFormatter';

export function MemberIdentityCard({
  member,
  attendance,
  statusText = 'ABSENSI BERHASIL',
  statusVariant = 'success', // success, info, neutral
  showTimestamp = true,
  size = 'lg', // 'sm', 'md', 'lg'
  className = ''
}) {
  if (!member) return null;

  const isSuccess = statusVariant === 'success';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1530] to-[#061024] border border-blue-500/30 p-7 shadow-2xl shadow-blue-950/60 backdrop-blur-2xl transition-all duration-500 ${
        isSuccess ? 'ring-2 ring-cyan-500/30 shadow-glow-cyan' : ''
      } ${className}`}
      style={{
        maxWidth: size === 'lg' ? '420px' : size === 'md' ? '360px' : '300px',
        width: '100%'
      }}
    >
      {/* Holographic Watermark Background */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            H
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
              HIMATIF CONNECT
            </h4>
            <p className="text-[10px] text-cyan-300 font-medium tracking-tight">
              Jakarta Global University
            </p>
          </div>
        </div>

        {/* Digital RFID Chip Icon Graphic */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-700/60 text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono font-bold tracking-wider">RFID</span>
        </div>
      </div>

      {/* Title Subheader */}
      <div className="text-center mb-4">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          KARTU PENGENAL MAHASISWA
        </span>
      </div>

      {/* Member Photo & Avatar */}
      <div className="flex flex-col items-center justify-center mb-5">
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl p-1 bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 shadow-xl overflow-hidden">
            <img
              src={member.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
              alt={member.name}
              className="w-full h-full object-cover rounded-xl bg-slate-800"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-white text-center mt-3.5 tracking-tight line-clamp-1">
          {member.name}
        </h3>
        <p className="text-xs font-mono font-semibold text-cyan-400 tracking-wider mt-0.5">
          {member.nim}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2.5 bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Angkatan
          </span>
          <span className="text-xs font-semibold text-white font-mono">
            {member.generation || '-'}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Departemen
          </span>
          <span className="text-xs font-semibold text-cyan-300 truncate block" title={member.department}>
            {member.department || '-'}
          </span>
        </div>
      </div>

      {/* Attendance Status Banner */}
      {statusText && (
        <div
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 mb-3 border shadow-sm ${
            isSuccess
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
              : 'bg-blue-950/70 border-blue-500/40 text-blue-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black tracking-wider uppercase font-mono">
            ✓ {statusText}
          </span>
        </div>
      )}

      {/* Date and Time Footer */}
      {showTimestamp && (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1 border-t border-slate-800/60">
          <span>{formatDateIndo(attendance?.date || new Date())}</span>
          <span className="font-bold text-slate-200">
            {attendance?.time || formatTimeIndo(new Date().toTimeString().split(' ')[0])}
          </span>
        </div>
      )}

      {/* Card RFID UID Chip Tag */}
      <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Radio className="w-2.5 h-2.5 text-cyan-400" /> UID: {member.uid_rfid}
        </span>
        <span>HIMATIF-SECURE-ID</span>
      </div>
    </div>
  );
}

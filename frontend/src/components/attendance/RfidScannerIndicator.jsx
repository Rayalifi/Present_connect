import React from 'react';
import { Radio, AlertTriangle, XCircle, CheckCircle, RefreshCw } from 'lucide-react';

export function RfidScannerIndicator({
  scanState = 'idle', // 'idle' | 'reading' | 'verifying' | 'success' | 'not_found' | 'cooldown'
  cooldownSeconds = 0,
  errorMessage = '',
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
      {/* Dynamic Visual Pulse Rings */}
      <div className="relative my-8 flex items-center justify-center">
        {scanState === 'idle' && (
          <>
            <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-radar-1 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-blue-500/20 animate-radar-2 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-indigo-500/20 animate-radar-3 pointer-events-none" />
          </>
        )}

        {/* Central Core Icon */}
        <div
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${
            scanState === 'idle'
              ? 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 shadow-glow-cyan'
              : scanState === 'reading' || scanState === 'verifying'
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/30 animate-pulse'
              : scanState === 'success'
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-glow-success'
              : scanState === 'cooldown'
              ? 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-500/30'
              : 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/30'
          }`}
        >
          {scanState === 'idle' && <Radio className="w-12 h-12 text-slate-950 animate-pulse" />}
          {(scanState === 'reading' || scanState === 'verifying') && (
            <RefreshCw className="w-12 h-12 text-slate-950 animate-spin" />
          )}
          {scanState === 'success' && <CheckCircle className="w-12 h-12 text-slate-950" />}
          {scanState === 'cooldown' && <AlertTriangle className="w-12 h-12 text-slate-950" />}
          {scanState === 'not_found' && <XCircle className="w-12 h-12 text-slate-950" />}
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="space-y-2 max-w-sm">
        {scanState === 'idle' && (
          <>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Silakan Tempelkan Kartu RFID
            </h3>
            <p className="text-xs text-slate-400">
              Dekatkan kartu RFID / KTM ke reader ESP32 atau gunakan tombol simulasi scan di bawah.
            </p>
          </>
        )}

        {scanState === 'reading' && (
          <>
            <h3 className="text-xl font-extrabold text-amber-400 tracking-tight">
              Membaca Kartu RFID...
            </h3>
            <p className="text-xs text-slate-400">
              Menerima UID dari reader RC522...
            </p>
          </>
        )}

        {scanState === 'verifying' && (
          <>
            <h3 className="text-xl font-extrabold text-cyan-400 tracking-tight">
              Mencari Data Anggota...
            </h3>
            <p className="text-xs text-slate-400">
              Memvalidasi data anggota di database HIMATIF...
            </p>
          </>
        )}

        {scanState === 'not_found' && (
          <>
            <h3 className="text-xl font-extrabold text-rose-400 tracking-tight">
              Kartu Tidak Terdaftar!
            </h3>
            <p className="text-xs text-rose-300/80">
              {errorMessage || 'UID kartu RFID belum didaftarkan pada data anggota HIMATIF.'}
            </p>
            {onReset && (
              <button
                onClick={onReset}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                <RefreshCw className="w-3 h-3" /> Coba kartu lain
              </button>
            )}
          </>
        )}

        {scanState === 'cooldown' && (
          <>
            <h3 className="text-xl font-extrabold text-amber-400 tracking-tight">
              Anda Sudah Melakukan Absensi
            </h3>
            <p className="text-xs text-amber-300/80">
              Sistem anti-double scan aktif. Mohon tunggu {cooldownSeconds} detik sebelum scan berikutnya.
            </p>
            {onReset && (
              <button
                onClick={onReset}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                <RefreshCw className="w-3 h-3" /> Reset tampilan
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

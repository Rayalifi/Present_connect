import React, { useState, useEffect, useRef } from 'react';
import { Radio, Sparkles, CheckCircle2, History, RotateCcw, AlertTriangle } from 'lucide-react';
import { RfidScannerIndicator } from '../../components/attendance/RfidScannerIndicator';
import { MemberIdentityCard } from '../../components/attendance/MemberIdentityCard';
import { RfidSimulatorPanel } from '../../components/attendance/RfidSimulatorModal';
import { attendanceService } from '../../services/attendanceService';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';

export function AttendanceLivePage() {
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'reading' | 'verifying' | 'success' | 'not_found' | 'cooldown'
  const [currentMember, setCurrentMember] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetTimerRef = useRef(null);
  const { latestScan } = useSocket();
  const toast = useToast();

  // Reset back to idle state
  const resetToIdle = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    setScanState('idle');
    setCurrentMember(null);
    setCurrentAttendance(null);
    setErrorMessage('');
  };

  // Schedule auto-reset after successful scan
  const scheduleReset = (delayMs = 6000) => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      resetToIdle();
    }, delayMs);
  };

  // Process RFID Scan (handles both API response and Socket.IO live push)
  const processScanResult = (result) => {
    if (result.success && result.member) {
      setScanState('success');
      setCurrentMember(result.member);
      setCurrentAttendance(result.attendance);
      toast.success('Kartu Dikenali!', `Absensi berhasil untuk ${result.member.name}`);
      scheduleReset(6000);
    } else if (result.type === 'COOLDOWN_ALERT' || result.error === 'COOLDOWN') {
      setScanState('cooldown');
      setCooldownSeconds(result.remainingSeconds || 30);
      toast.warning('Anti-Double Tap', result.message || 'Anda sudah melakukan absensi baru saja.');
      scheduleReset(5000);
    } else {
      setScanState('not_found');
      setErrorMessage(result.message || 'Kartu Tidak Terdaftar dalam database anggota.');
      toast.error('Gagal', result.message || 'Kartu Tidak Terdaftar');
      scheduleReset(5000);
    }
  };

  // Trigger scan from simulator or HTTP call
  const handleScanRfid = async (uid) => {
    setLoading(true);
    setScanState('verifying');

    try {
      const response = await attendanceService.scanRfid(uid);
      processScanResult(response);
    } catch (error) {
      const errData = error.response?.data || {};
      processScanResult(errData);
    } finally {
      setLoading(false);
    }
  };

  // Listen to incoming scans from ESP32 via Socket.IO
  useEffect(() => {
    if (latestScan) {
      processScanResult(latestScan);
    }
  }, [latestScan]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
              LIVE ATTENDANCE TERMINAL
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Presensi Kartu RFID ESP32
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Layar interaktif penerimaan UID kartu RFID langsung dari reader RC522.
          </p>
        </div>

        {scanState !== 'idle' && (
          <button
            onClick={resetToIdle}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembali Siap Scan</span>
          </button>
        )}
      </div>

      {/* Main Terminal Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center Main Screen: Scanner / Digital ID Card */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[480px]">
          {scanState === 'success' && currentMember ? (
            <div className="flex flex-col items-center animate-fadeIn duration-500 w-full">
              <MemberIdentityCard
                member={currentMember}
                attendance={currentAttendance}
                statusText="ABSENSI BERHASIL"
                statusVariant="success"
                size="lg"
                className="transform scale-100 hover:scale-[1.02] transition-transform"
              />
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 animate-pulse">
                <span>Layar akan kembali otomatis dalam beberapa detik...</span>
              </p>
            </div>
          ) : (
            <div className="w-full">
              <RfidScannerIndicator
                scanState={scanState}
                cooldownSeconds={cooldownSeconds}
                errorMessage={errorMessage}
                onReset={resetToIdle}
              />
            </div>
          )}
        </div>

        {/* Right Panel: Integrated Simulator & Quick Info */}
        <div className="lg:col-span-5 space-y-5">
          {/* Simulator Component */}
          <RfidSimulatorPanel
            onScan={handleScanRfid}
            loading={loading}
          />

          {/* Quick Hardware Guide Callout */}
          <div className="rounded-2xl bg-blue-950/30 border border-blue-500/20 p-4 backdrop-blur-xl">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5" /> Integrasi ESP32 + RC522
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ESP32 mengirimkan request HTTP POST ke URL <code>/api/rfid/scan</code> dengan JSON <code>{`{"uid": "A3:7F:21:9C"}`}</code>. Layar ini akan merespons secara otomatis tanpa perlu refresh manual.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

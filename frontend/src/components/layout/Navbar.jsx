import React, { useState, useEffect } from 'react';
import { Menu, Clock, Radio, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateIndo, formatTimeIndo } from '../../utils/dateFormatter';
import { useSocket } from '../../context/SocketContext';

export function Navbar({ onOpenSidebar, title = 'Dashboard' }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isConnected } = useSocket();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Himpunan Mahasiswa Teknik Informatika - JGU
          </p>
        </div>
      </div>

      {/* Right Navbar Items */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live Clock Widget */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-slate-400 font-sans">
            {formatDateIndo(currentTime)} •
          </span>
          <span className="font-bold text-white">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
          </span>
        </div>

        {/* Quick Shortcut to Live Attendance Scan */}
        <Link
          to="/attendance"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
          <span className="hidden sm:inline">Tap RFID</span>
        </Link>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard Admin',
  '/attendance': 'Monitor & Absensi RFID',
  '/attendance/history': 'Riwayat Absensi',
  '/members': 'Data Anggota HIMATIF',
  '/members/create': 'Tambah Anggota Baru',
  '/settings': 'Pengaturan Sistem'
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  let currentTitle = 'HIMATIF Connect';
  for (const [path, title] of Object.entries(pageTitles)) {
    if (location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))) {
      currentTitle = title;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-[#080E1E] text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} title={currentTitle} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

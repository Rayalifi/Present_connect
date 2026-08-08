import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AttendanceLivePage } from './pages/attendance/AttendanceLivePage';
import { AttendanceHistoryPage } from './pages/attendance/AttendanceHistoryPage';
import { MembersListPage } from './pages/members/MembersListPage';
import { MemberCreatePage } from './pages/members/MemberCreatePage';
import { MemberEditPage } from './pages/members/MemberEditPage';
import { MemberDetailPage } from './pages/members/MemberDetailPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080E1E] flex items-center justify-center">
        <LoadingSpinner text="Memeriksa sesi pengguna..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="attendance" element={<AttendanceLivePage />} />
        <Route path="attendance/history" element={<AttendanceHistoryPage />} />
        
        {/* Members Management */}
        <Route path="members" element={<MembersListPage />} />
        <Route path="members/create" element={<MemberCreatePage />} />
        <Route path="members/:id" element={<MemberDetailPage />} />
        <Route path="members/:id/edit" element={<MemberEditPage />} />
        
        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

import React, { useState } from 'react';
import {
  Settings,
  User,
  KeyRound,
  Sliders,
  ShieldCheck,
  Building,
  CheckCircle2,
  Server,
  Radio
} from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSocket } from '../../context/SocketContext';
import { authService } from '../../services/authService';

export function SettingsPage() {
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const toast = useToast();

  // Password update form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // RFID Cooldown
  const [cooldown, setCooldown] = useState('30');
  const [cooldownSaved, setCooldownSaved] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Gagal', 'Konfirmasi password baru tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Gagal', 'Password baru minimal 6 karakter.');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      toast.success('Berhasil', 'Password admin berhasil diperbarui.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Gagal', err.response?.data?.message || 'Password lama salah.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveCooldown = (e) => {
    e.preventDefault();
    setCooldownSaved(true);
    toast.success('Disimpan', `Cooldown anti-double scan diatur ke ${cooldown} detik.`);
    setTimeout(() => setCooldownSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          Pengaturan Sistem & Profil
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Konfigurasi sistem presensi RFID, parameter keamanan, dan akun administrator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile & Password Change */}
        <Card>
          <CardHeader
            title="Akun Administrator"
            subtitle="Kelola keamanan dan kata sandi login"
          />

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Username Admin"
              value={user?.username || 'admin'}
              disabled
              icon={User}
              className="opacity-70 cursor-not-allowed"
            />

            <Input
              label="Email"
              value={user?.email || 'admin@himatif.jgu.ac.id'}
              disabled
              className="opacity-70 cursor-not-allowed"
            />

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <Input
                label="Password Saat Ini"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                icon={KeyRound}
              />

              <Input
                label="Password Baru"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                icon={KeyRound}
              />

              <Input
                label="Konfirmasi Password Baru"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                icon={KeyRound}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={passwordLoading}
              className="w-full"
            >
              Perbarui Password
            </Button>
          </form>
        </Card>

        {/* System & Hardware Parameters */}
        <div className="space-y-6">
          {/* RFID Cooldown Config */}
          <Card>
            <CardHeader
              title="Konfigurasi RFID & ESP32"
              subtitle="Aturan pembacaan kartu fisik RC522"
            />

            <form onSubmit={handleSaveCooldown} className="space-y-4">
              <Input
                label="Anti-Double Tap Cooldown (Detik)"
                type="number"
                min="5"
                max="300"
                value={cooldown}
                onChange={(e) => setCooldown(e.target.value)}
                helperText="Waktu tunggu sebelum kartu yang sama dapat melakukan scan ulang."
                icon={Radio}
              />

              <Button
                type="submit"
                variant="cyan"
                size="md"
                className="w-full"
              >
                {cooldownSaved ? 'Tersimpan ✓' : 'Simpan Pengaturan RFID'}
              </Button>
            </form>
          </Card>

          {/* System Status & Organization Info */}
          <Card>
            <CardHeader
              title="Status Server & Organisasi"
              subtitle="Informasi status jaringan sistem"
            />

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Organisasi</span>
                <span className="font-bold text-white">HIMATIF JGU</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">WebSocket / Realtime Push</span>
                <span className={`font-mono font-bold ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isConnected ? 'ONLINE (Port 5000)' : 'STANDBY'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">RFID Endpoint API</span>
                <span className="font-mono text-cyan-400">/api/rfid/scan</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

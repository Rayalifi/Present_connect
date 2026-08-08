import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Radio,
  Building2,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { memberService } from '../../services/memberService';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, GENERATIONS } from '../../utils/constants';

export function MembersListPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [generation, setGeneration] = useState('all');
  const [status, setStatus] = useState('all');

  // Delete modal state
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await memberService.getAll({
        search,
        department,
        generation,
        status
      });
      setMembers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal', 'Tidak dapat memuat data anggota.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [department, generation, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setDeleteLoading(true);
    try {
      await memberService.delete(memberToDelete.id);
      toast.success('Berhasil', `Data anggota ${memberToDelete.name} berhasil dihapus.`);
      setMemberToDelete(null);
      fetchMembers();
    } catch (err) {
      toast.error('Gagal Menghapus', err.response?.data?.message || 'Terjadi kesalahan.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const departmentOptions = [
    { value: 'all', label: 'Semua Departemen' },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d }))
  ];

  const generationOptions = [
    { value: 'all', label: 'Semua Angkatan' },
    ...GENERATIONS.map((g) => ({ value: g, label: `Angkatan ${g}` }))
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Data Anggota HIMATIF
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola master data pengurus & anggota serta alokasi UID kartu RFID.
          </p>
        </div>

        <Link to="/members/create">
          <Button variant="cyan" size="md">
            <UserPlus className="w-4 h-4" />
            <span>Tambah Anggota Baru</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan Nama, NIM, atau UID RFID..."
              icon={Search}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={departmentOptions}
            />
          </div>

          <div className="w-full md:w-40">
            <Select
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              options={generationOptions}
            />
          </div>

          <Button type="submit" variant="secondary" size="md" className="shrink-0">
            <Search className="w-4 h-4" />
            <span>Cari</span>
          </Button>
        </form>
      </div>

      {/* Members Data Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <LoadingSpinner text="Memuat data anggota..." size="md" className="py-16" />
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Tidak Ada Anggota"
            description="Belum ada anggota yang cocok dengan filter pencarian ini."
            actionLabel="Tambah Anggota"
            onAction={() => window.location.href = '/members/create'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Anggota</th>
                  <th className="py-3.5 px-4">NIM</th>
                  <th className="py-3.5 px-4">Departemen</th>
                  <th className="py-3.5 px-4">Angkatan</th>
                  <th className="py-3.5 px-4">UID RFID</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {member.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID #{member.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                      {member.nim}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {member.department}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {member.generation}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-[11px] font-bold text-cyan-400">
                        <Radio className="w-3 h-3 text-cyan-400" />
                        {member.uid_rfid}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={member.status === 'active' ? 'success' : 'default'}
                        dot={member.status === 'active'}
                        size="sm"
                      >
                        {member.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/members/${member.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                          title="Lihat Detail & Kartu ID"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/members/${member.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Anggota"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus Anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        title="Hapus Data Anggota"
        subtitle="Konfirmasi penghapusan data anggota HIMATIF"
      >
        {memberToDelete && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Apakah Anda yakin ingin menghapus data anggota{' '}
              <strong className="text-white">{memberToDelete.name}</strong> (NIM: {memberToDelete.nim})? Semua riwayat absensi yang terkait juga akan dihapus.
            </p>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMemberToDelete(null)}
                disabled={deleteLoading}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                Ya, Hapus Anggota
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

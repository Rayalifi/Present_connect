import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Upload, Radio, Hash, User, Building2, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { memberService } from '../../services/memberService';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, GENERATIONS } from '../../utils/constants';

export function MemberEditPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nim: '',
    name: '',
    generation: '2024',
    department: 'Multimedia',
    uid_rfid: '',
    status: 'active',
    photoUrl: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await memberService.getById(id);
        if (res.data?.member) {
          const m = res.data.member;
          setFormData({
            nim: m.nim || '',
            name: m.name || '',
            generation: m.generation || '2024',
            department: m.department || 'Multimedia',
            uid_rfid: m.uid_rfid || '',
            status: m.status || 'active',
            photoUrl: m.photo || ''
          });
          setPreviewUrl(m.photo);
        }
      } catch (err) {
        console.error(err);
        toast.error('Gagal', 'Tidak dapat mengambil detail anggota.');
        navigate('/members');
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nim.trim()) newErrors.nim = 'NIM anggota wajib diisi.';
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.uid_rfid.trim()) newErrors.uid_rfid = 'UID kartu RFID wajib diisi.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const data = new FormData();
      data.append('nim', formData.nim.trim());
      data.append('name', formData.name.trim());
      data.append('generation', formData.generation);
      data.append('department', formData.department);
      data.append('uid_rfid', formData.uid_rfid.trim().toUpperCase());
      data.append('status', formData.status);
      if (formData.photoUrl) data.append('photoUrl', formData.photoUrl.trim());
      if (photoFile) data.append('photo', photoFile);

      await memberService.update(id, data);
      toast.success('Berhasil', `Data anggota ${formData.name} berhasil diperbarui.`);
      navigate(`/members/${id}`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Gagal memperbarui data anggota.';
      toast.error('Gagal', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Memuat formulir edit anggota..." size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to={`/members/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Anggota</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="border-b border-slate-800 pb-5 mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Edit className="w-5 h-5 text-cyan-400" />
            Edit Data Anggota
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah informasi profil, departemen, atau alokasi UID RFID anggota.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-8 h-8 text-slate-500" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Foto Profil Anggota
              </label>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="NIM"
              id="nim"
              required
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              icon={Hash}
              error={errors.nim}
            />

            <Input
              label="Nama Lengkap"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              error={errors.name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Departemen"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              icon={Building2}
            />

            <Select
              label="Angkatan"
              value={formData.generation}
              onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
              options={GENERATIONS.map((g) => ({ value: g, label: `Angkatan ${g}` }))}
              icon={GraduationCap}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="UID Kartu RFID"
              id="uid_rfid"
              required
              value={formData.uid_rfid}
              onChange={(e) => setFormData({ ...formData, uid_rfid: e.target.value })}
              icon={Radio}
              error={errors.uid_rfid}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Non-Aktif' }
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate(`/members/${id}`)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="md"
              loading={saving}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

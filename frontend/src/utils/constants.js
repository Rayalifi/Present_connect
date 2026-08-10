export const APP_CONFIG = {
  APP_NAME: 'HIMATIF Connect',
  ORG_NAME: 'HIMATIF JGU',
  ORG_FULL_NAME: 'Himpunan Mahasiswa Teknik Informatika',
  UNIVERSITY: 'Jakarta Global University',

  API_BASE_URL:
    import.meta.env.VITE_API_URL ||
    'https://presentconnect-production.up.railway.app/api',

  SOCKET_URL:
    import.meta.env.VITE_SOCKET_URL ||
    'https://presentconnect-production.up.railway.app',

  COOLDOWN_SECONDS: 30
};

export const getPhotoUrl = (photo) => {
  if (!photo) return '';

  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }

  const apiBase = (APP_CONFIG.API_BASE_URL || '').replace(/\/api\/?$/, '');

  return `${apiBase}${photo.startsWith('/') ? photo : `/${photo}`}`;
};

export const DEPARTMENTS = [
  'Multimedia',
  'Riset dan Teknologi',
  'Pengembangan SDM',
  'Hubungan Masyarakat',
  'Komunikasi & Informasi',
  'Administrasi & Keuangan'
];

export const GENERATIONS = ['2021', '2022', '2023', '2024', '2025', '2026'];

// Sample RFID cards for instant 1-click simulator testing
export const DEMO_RFID_CARDS = [
  {
    uid: 'A3:7F:21:9C',
    name: 'Rayhan Ali Firmansyah',
    nim: '20240001',
    dept: 'Multimedia'
  },
  {
    uid: 'D4:8E:19:0B',
    name: 'Nabila Zahra Putri',
    nim: '20230015',
    dept: 'Riset dan Teknologi'
  },
  {
    uid: '5B:6C:88:1A',
    name: 'Fajar Pratama Wijaya',
    nim: '20240022',
    dept: 'Pengembangan SDM'
  },
  {
    uid: 'C2:90:3F:7E',
    name: 'Dinda Ayu Maharani',
    nim: '20220005',
    dept: 'Hubungan Masyarakat'
  },
  {
    uid: 'E8:12:4A:91',
    name: 'Muhammad Rizky Ramadhan',
    nim: '20230048',
    dept: 'Komunikasi & Informasi'
  },
  {
    uid: 'F1:2B:3C:4D',
    name: 'Siti Nurhaliza',
    nim: '20240089',
    dept: 'Administrasi & Keuangan'
  },
  {
    uid: '99:AA:BB:CC',
    name: 'Kartu Belum Terdaftar (Test Error)',
    nim: '-',
    dept: 'Tidak Ditemukan'
  }
];

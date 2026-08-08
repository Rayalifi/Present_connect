#Sistem Absensi RFID Berbasis ESP32 & Web

---

## 🌟 Fitur Utama

1. **Pencatatan Presensi RFID Otomatis**: Menerima UID kartu dari mikrokontroler ESP32 + RC522 melalui HTTP API secara instan.
2. **Layar Terminal Presensi Realtime (`/attendance`)**: Menampilkan animasi pemindaian kartu dan pop-up **Digital Member Identity Card** dengan foto, NIM, nama, angkatan, departemen, dan timestamp presensi.
3. **Sistem Anti-Double Scan (Cooldown)**: Mencegah duplikasi data absensi jika kartu yang sama ditempelkan berulang kali dalam durasi waktu tertentu (default: 30 detik).
4. **Simulator RFID Bawaan**: Uji coba scan RFID langsung dari antarmuka web tanpa memerlukan alat ESP32 fisik.
5. **Dashboard Statistik Realtime (`/dashboard`)**: Ringkasan total anggota, kehadiran hari ini, persentase kehadiran, grafik mingguan, dan live feed absensi via WebSocket (Socket.IO).
6. **Manajemen Master Data Anggota (`/members`)**: CRUD data anggota lengkap dengan unggah foto profil, filter angkatan & departemen, serta detail riwayat presensi individual.
7. **Riwayat Absensi & Export CSV (`/attendance/history`)**: Filter pencarian berdasarkan rentang tanggal, departemen, dan angkatan dengan fitur ekspor data ke format CSV.
8. **Keamanan Sistem**: Autentikasi JWT, enkripsi kata sandi menggunakan bcrypt, proteksi header Helmet, CORS, input sanitization, dan rate limiting.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, Socket.IO-Client.
- **Backend**: Node.js, Express.js, Socket.IO, Multer, Bcrypt.js, JsonWebToken.
- **Database**: MySQL (`mysql2/promise`) dengan *smart in-memory fallback adapter* untuk kemudahan demonstrasi lokal.
- **Hardware Target**: ESP32 DevKit V1 + Modul RFID-RC522 (SPI).

---

## 📁 Struktur Folder Project

```
himatif-connect/
│
├── frontend/                     # Web App Client (React + Vite + Tailwind)
│   ├── public/                   # Asset statis
│   ├── src/
│   │   ├── components/           # UI Kit, Layout, Dashboard, Attendance Card
│   │   ├── pages/                # Auth, Dashboard, Attendance, Members, Settings
│   │   ├── services/             # Axios API Client & Service Modules
│   │   ├── context/              # AuthContext, ToastContext, SocketContext
│   │   ├── utils/                # Date formatting, CSV exporter, Constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                      # API & WebSocket Server (Node.js + Express)
│   ├── src/
│   │   ├── config/               # Database Pool & Socket.IO initialization
│   │   ├── controllers/          # Business logic (Auth, Member, RFID, Stats)
│   │   ├── middleware/           # Auth JWT, Error Handler, Upload Multer
│   │   ├── models/               # Query abstraction (Admin, Member, Attendance)
│   │   ├── routes/               # Express routing endpoints
│   │   ├── utils/                # Cooldown helper, JWT signer, Response helper
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/                  # Penyimpanan berkas foto profil anggota
│   ├── .env.example
│   └── package.json
│
├── database/                     # Skrip database SQL
│   ├── schema.sql                # DDL skema tabel MySQL
│   └── seed.sql                  # Data awal (Admin & 6 sampel anggota)
│
├── docs/                         # Dokumentasi teknis & firmware
│   ├── API.md                    # Dokumentasi REST API & WebSocket Events
│   ├── DATABASE.md               # Dokumentasi skema dan relasi tabel
│   └── ESP32_RC522_GUIDE.md      # Panduan perakitan & kode C++ Arduino ESP32
│
├── .gitignore
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Sistem

### 1. Prasyarat Sistem
- **Node.js** v18.x atau versi lebih baru
- **NPM**
- **MySQL Database Server** (XAMPP / MySQL Community Server / MariaDB)

---

### 2. Setup Database MySQL

1. Buat database dan jalankan skema tabel:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. Isi data dummy dan akun administrator:
   ```bash
   mysql -u root -p < database/seed.sql
   ```

> **Akun Default Administrator:**
> - **Username**: `admin`
> - **Password**: `admin123`

---

### 3. Setup & Menjalankan Backend API

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Sesuaikan konfigurasi `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=himatif_connect
   JWT_SECRET=himatif_connect_super_secret_jwt_key_2024_jgu
   COOLDOWN_SECONDS=30
   ```
4. Jalankan server:
   ```bash
   npm start
   # atau untuk mode development live reload:
   npm run dev
   ```
   *Server backend akan berjalan di `http://localhost:5000`.*

---

### 4. Setup & Menjalankan Frontend Web

1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
   *Frontend akan dapat diakses di `http://localhost:3000`.*

---

## 📡 Daftar Endpoint API Utama

| Metode | Endpoint | Keterangan | Autentikasi |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login admin sistem | Publik |
| `GET` | `/api/auth/me` | Mengambil profil admin login | Bearer Token |
| `POST` | `/api/rfid/scan` | Menerima scan kartu dari ESP32 / Simulator | Publik |
| `GET` | `/api/stats/summary` | Ringkasan dashboard & log hari ini | Bearer Token |
| `GET` | `/api/attendance/today` | Daftar presensi hari ini | Publik / Admin |
| `GET` | `/api/attendance/history` | Riwayat presensi (Filter & Search) | Bearer Token |
| `GET` | `/api/members` | Daftar seluruh anggota | Bearer Token |
| `POST` | `/api/members` | Menambah anggota baru (Multipart / JSON) | Bearer Token |
| `PUT` | `/api/members/:id` | Mengedit data anggota | Bearer Token |
| `DELETE` | `/api/members/:id` | Menghapus anggota | Bearer Token |

---

## 💳 Contoh Request Scan RFID (ESP32 & Simulator)

**Endpoint:** `POST /api/rfid/scan`  
**Header:** `Content-Type: application/json`

**Payload:**
```json
{
  "uid": "A3:7F:21:9C"
}
```

**Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Absensi berhasil",
  "member": {
    "id": 1,
    "uid_rfid": "A3:7F:21:9C",
    "nim": "20240001",
    "name": "Rayhan Ali Firmansyah",
    "generation": "2024",
    "department": "Multimedia",
    "photo": "/uploads/members/member-1.jpg"
  },
  "attendance": {
    "id": 14,
    "date": "2026-08-09",
    "time": "08:15:32",
    "status": "Hadir"
  }
}
```

---

## 🔌 Integrasi Hardware ESP32 + RC522

Lihat panduan pengkabelan pinout dan source code C++ Arduino selengkapnya di berkas:
📄 [docs/ESP32_RC522_GUIDE.md](file:///C:/Users/HYPE%20AMD/.gemini/antigravity-ide/scratch/himatif-connect/docs/ESP32_RC522_GUIDE.md)

---

## 👨‍💻 Pengembang
Dikembangkan untuk **HIMATIF JGU** (Himpunan Mahasiswa Teknik Informatika - Jakarta Global University).

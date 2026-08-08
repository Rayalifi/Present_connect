# HIMATIF Connect - Database Schema Documentation

Database yang digunakan adalah **MySQL** dengan nama database default `himatif_connect`.

---

## Entity Relationship Diagram (ERD Concept)

```
+--------------------+           +------------------------+
|      admins        |           |        members         |
+--------------------+           +------------------------+
| id (PK, AI)        |           | id (PK, AI)            |
| username (Unique)  |           | uid_rfid (Unique, idx) |
| email (Unique)     |           | nim (Unique, idx)      |
| password_hash      |           | name                   |
| created_at         |           | generation (idx)       |
+--------------------+           | department (idx)       |
                                 | photo                  |
                                 | status (active/inact.) |
                                 | created_at             |
                                 | updated_at             |
                                 +-----------+------------+
                                             | 1
                                             |
                                             | N
                                 +-----------v------------+
                                 |       attendance       |
                                 +------------------------+
                                 | id (PK, AI)            |
                                 | member_id (FK)         |
                                 | uid_rfid               |
                                 | attendance_date (idx)  |
                                 | attendance_time        |
                                 | status                 |
                                 | created_at             |
                                 +------------------------+
```

---

## 1. Tabel `admins`
Menyimpan akun pengelola dashboard HIMATIF Connect.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `username` | `VARCHAR(50)` | Username unik untuk login |
| `email` | `VARCHAR(100)` | Email admin unik |
| `password_hash`| `VARCHAR(255)` | Password yang di-hash dengan bcrypt |
| `created_at` | `TIMESTAMP` | Waktu pendaftaran |

---

## 2. Tabel `members`
Menyimpan master data anggota pengurus/anggota HIMATIF.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `uid_rfid` | `VARCHAR(50)` | UID unik dari kartu RFID/e-KTP/Gantungan Kunci |
| `nim` | `VARCHAR(20)` | Nomor Induk Mahasiswa (Unik) |
| `name` | `VARCHAR(100)` | Nama lengkap anggota |
| `generation` | `VARCHAR(10)` | Angkatan (misal: '2024') |
| `department` | `VARCHAR(50)` | Departemen/Divisi (misal: 'Multimedia') |
| `photo` | `VARCHAR(255)` | Path file foto lokal atau URL avatar |
| `status` | `ENUM('active', 'inactive')`| Status keaktifan anggota |
| `created_at` | `TIMESTAMP` | Waktu dibuat |
| `updated_at` | `TIMESTAMP` | Waktu pembaruan terakhir |

---

## 3. Tabel `attendance`
Menyimpan log transaksi presensi kehadiran berdasarkan ketukan RFID.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `member_id` | `INT` | Foreign Key ke `members.id` (CASCADE) |
| `uid_rfid` | `VARCHAR(50)` | UID kartu saat scan |
| `attendance_date`| `DATE` | Tanggal absensi (YYYY-MM-DD) |
| `attendance_time`| `TIME` | Waktu absensi (HH:MM:SS) |
| `status` | `VARCHAR(30)` | Status kehadiran ('Hadir', 'Izin', dll.) |
| `created_at` | `TIMESTAMP` | Timestamp pencatatan |

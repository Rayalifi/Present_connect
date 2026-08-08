# HIMATIF Connect - API Documentation

Sistem ini menyediakan RESTful API dan WebSocket (Socket.IO) untuk integrasi web dashboard dan perangkat keras ESP32 + RC522 RFID.

Base URL: `http://localhost:5000/api` (atau `http://<IP-SERVER-LOKAL>:5000/api` untuk ESP32)

---

## 1. Authentication

### `POST /auth/login`
Autentikasi admin sistem.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@himatif.jgu.ac.id"
    }
  }
}
```

### `GET /auth/me`
Mendapatkan info profil admin yang sedang login. *(Requires `Authorization: Bearer <token>`)*

---

## 2. RFID Attendance Endpoints (ESP32 & Simulator)

### `POST /rfid/scan`
Endpoint utama yang dipanggil oleh **ESP32** dan **Simulasi Web** saat kartu RFID ditempelkan ke reader RC522.

**Request Header:**
`Content-Type: application/json`

**Request Body:**
```json
{
  "uid": "A3:7F:21:9C"
}
```

**Response - Kartu Dikenali (200 OK):**
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
    "photo": "/uploads/members/member-1.jpg",
    "status": "active"
  },
  "attendance": {
    "id": 42,
    "date": "2026-08-09",
    "time": "08:15:32",
    "status": "Hadir"
  }
}
```

**Response - Anti-Double Scan / Cooldown (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "COOLDOWN",
  "message": "Anda sudah melakukan absensi baru saja. Silakan tunggu beberapa saat.",
  "member": {
    "name": "Rayhan Ali Firmansyah",
    "nim": "20240001"
  }
}
```

**Response - Kartu Tidak Terdaftar (404 Not Found):**
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Kartu Tidak Terdaftar",
  "uid": "XX:YY:ZZ:WW"
}
```

---

## 3. Members Management

Semua endpoint member dilindungi dengan token JWT admin.

- `GET /members` : Mengambil daftar anggota (Query: `?search=...&department=...&generation=...&page=1&limit=10`)
- `GET /members/:id` : Mengambil detail anggota beserta riwayat absensinya
- `POST /members` : Menambahkan anggota baru (Mendukung `multipart/form-data` dengan foto)
- `PUT /members/:id` : Memperbarui data anggota
- `DELETE /members/:id` : Menghapus anggota

---

## 4. Attendance & Stats

- `GET /attendance/today` : Mengambil daftar absensi hari ini
- `GET /attendance/history` : Mengambil riwayat absensi dengan filter tanggal, departemen, dan angkatan
- `GET /attendance/stats/summary` : Ringkasan statistik (Total anggota, hadir hari ini, persentase kehadiran, grafik mingguan)

---

## 5. WebSocket Events (Socket.IO)

Ketika terjadi scan RFID, server membroadcast event:
- Event: `attendance:scanned`
  - Payload: Objek hasil scan (member info & status absensi)
- Event: `attendance:updated`
  - Payload: Ringkasan statistik terbaru hari ini untuk pembaruan dashboard realtime.

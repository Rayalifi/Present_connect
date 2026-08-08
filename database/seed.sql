-- ===================================================
-- HIMATIF Connect - Seed Data
-- ===================================================

-- USE himatif_connect;

-- 1. Seed Admin (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO admins (id, username, email, password_hash) VALUES
(1, 'admin', 'admin@himatif.jgu.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 2. Seed Members
INSERT INTO members (id, uid_rfid, nim, name, generation, department, photo, status) VALUES
(1, 'A3:7F:21:9C', '20240001', 'Rayhan Ali Firmansyah', '2024', 'Multimedia', '/uploads/members/member-1.jpg', 'active'),
(2, 'D4:8E:19:0B', '20230015', 'Nabila Zahra Putri', '2023', 'Riset dan Teknologi', '/uploads/members/member-2.jpg', 'active'),
(3, '5B:6C:88:1A', '20240022', 'Fajar Pratama Wijaya', '2024', 'Pengembangan SDM', '/uploads/members/member-3.jpg', 'active'),
(4, 'C2:90:3F:7E', '20220005', 'Dinda Ayu Maharani', '2022', 'Hubungan Masyarakat', '/uploads/members/member-4.jpg', 'active'),
(5, 'E8:12:4A:91', '20230048', 'Muhammad Rizky Ramadhan', '2023', 'Komunikasi & Informasi', '/uploads/members/member-5.jpg', 'active'),
(6, 'F1:2B:3C:4D', '20240089', 'Siti Nurhaliza', '2024', 'Administrasi & Keuangan', '/uploads/members/member-6.jpg', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Seed System Settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
('cooldown_seconds', '30'),
('organization_name', 'HIMATIF JGU'),
('organization_subtext', 'Himpunan Mahasiswa Teknik Informatika - Jakarta Global University'),
('attendance_active', 'true')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- 4. Seed Attendance History (Contoh data beberapa hari terakhir)
INSERT INTO attendance (member_id, uid_rfid, attendance_date, attendance_time, status) VALUES
(1, 'A3:7F:21:9C', CURDATE(), '08:15:32', 'Hadir'),
(2, 'D4:8E:19:0B', CURDATE(), '08:22:10', 'Hadir'),
(3, '5B:6C:88:1A', CURDATE(), '08:45:00', 'Hadir'),
(1, 'A3:7F:21:9C', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:10:15', 'Hadir'),
(2, 'D4:8E:19:0B', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:30:22', 'Hadir'),
(4, 'C2:90:3F:7E', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:50:00', 'Hadir'),
(5, 'E8:12:4A:91', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:01:14', 'Hadir'),
(1, 'A3:7F:21:9C', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:05:00', 'Hadir'),
(3, '5B:6C:88:1A', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:19:40', 'Hadir'),
(4, 'C2:90:3F:7E', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:40:11', 'Hadir'),
(6, 'F1:2B:3C:4D', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:42:55', 'Hadir');

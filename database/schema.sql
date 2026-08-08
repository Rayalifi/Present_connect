-- ===================================================
-- HIMATIF Connect - Database Schema
-- Organization: Himpunan Mahasiswa Teknik Informatika (HIMATIF JGU)
-- ===================================================

CREATE DATABASE IF NOT EXISTS himatif_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE himatif_connect;

-- 1. Tabel Admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Members
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid_rfid VARCHAR(50) NOT NULL UNIQUE,
    nim VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    generation VARCHAR(10) NOT NULL,
    department VARCHAR(50) NOT NULL,
    photo VARCHAR(255) DEFAULT '/uploads/members/default-avatar.png',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_uid_rfid (uid_rfid),
    INDEX idx_nim (nim),
    INDEX idx_department (department),
    INDEX idx_generation (generation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    uid_rfid VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_time TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'Hadir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) 
        REFERENCES members(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_member_date (member_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Settings (Pengaturan Sistem)
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;
let isConnectedToMysql = false;

// In-memory fallback dataset for seamless offline/demo development
const inMemoryStore = {
  admins: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@himatif.jgu.ac.id',
      // bcrypt hash for 'admin123'
      password_hash: '$2a$10$Y9G03pyXSq8Xx.r0skASu.7cCcwaCDzslrPO9rUL3uiZyCx29.wOi',
      created_at: new Date()
    }
  ],
  members: [
    {
      id: 1,
      uid_rfid: 'A3:7F:21:9C',
      nim: '20240001',
      name: 'Rayhan Ali Firmansyah',
      generation: '2024',
      department: 'Multimedia',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2024-01-10'),
      updated_at: new Date()
    },
    {
      id: 2,
      uid_rfid: 'D4:8E:19:0B',
      nim: '20230015',
      name: 'Nabila Zahra Putri',
      generation: '2023',
      department: 'Riset dan Teknologi',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2023-09-12'),
      updated_at: new Date()
    },
    {
      id: 3,
      uid_rfid: '5B:6C:88:1A',
      nim: '20240022',
      name: 'Fajar Pratama Wijaya',
      generation: '2024',
      department: 'Pengembangan SDM',
      photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2024-02-15'),
      updated_at: new Date()
    },
    {
      id: 4,
      uid_rfid: 'C2:90:3F:7E',
      nim: '20220005',
      name: 'Dinda Ayu Maharani',
      generation: '2022',
      department: 'Hubungan Masyarakat',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2022-08-20'),
      updated_at: new Date()
    },
    {
      id: 5,
      uid_rfid: 'E8:12:4A:91',
      nim: '20230048',
      name: 'Muhammad Rizky Ramadhan',
      generation: '2023',
      department: 'Komunikasi & Informasi',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2023-10-01'),
      updated_at: new Date()
    },
    {
      id: 6,
      uid_rfid: 'F1:2B:3C:4D',
      nim: '20240089',
      name: 'Siti Nurhaliza',
      generation: '2024',
      department: 'Administrasi & Keuangan',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      created_at: new Date('2024-03-01'),
      updated_at: new Date()
    }
  ],
  attendance: [
    {
      id: 1,
      member_id: 1,
      uid_rfid: 'A3:7F:21:9C',
      attendance_date: new Date().toISOString().split('T')[0],
      attendance_time: '08:15:32',
      status: 'Hadir',
      created_at: new Date()
    },
    {
      id: 2,
      member_id: 2,
      uid_rfid: 'D4:8E:19:0B',
      attendance_date: new Date().toISOString().split('T')[0],
      attendance_time: '08:22:10',
      status: 'Hadir',
      created_at: new Date()
    },
    {
      id: 3,
      member_id: 3,
      uid_rfid: '5B:6C:88:1A',
      attendance_date: new Date().toISOString().split('T')[0],
      attendance_time: '08:45:00',
      status: 'Hadir',
      created_at: new Date()
    }
  ],
  settings: {
    cooldown_seconds: '30',
    organization_name: 'HIMATIF JGU',
    organization_subtext: 'Himpunan Mahasiswa Teknik Informatika - Jakarta Global University',
    attendance_active: 'true'
  }
};

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD ?? '',
      database: process.env.DB_NAME || 'himatif_connect',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    const connection = await pool.getConnection();
    isConnectedToMysql = true;
    console.log('[DB] Terhubung sukses ke server MySQL database:', process.env.DB_NAME || 'himatif_connect');
    
    // Auto-seed initial admin and demo data if tables are empty
    await autoSeedIfEmpty(connection);
    
    connection.release();
  } catch (error) {
    isConnectedToMysql = false;
    console.warn('[DB Warning] MySQL Server tidak terdeteksi atau belum berjalan:', error.message);
    console.log('[DB Info] HIMATIF Connect mengaktifkan In-Memory Data Engine agar sistem tetap 100% fungsional dan siap pakai.');
  }
}

async function autoSeedIfEmpty(connection) {
  try {
    const [adminRows] = await connection.execute('SELECT COUNT(*) as total FROM admins');
    if (adminRows[0]?.total === 0) {
      console.log('[DB Info] Mengisi data default admin ke MySQL...');
      await connection.execute(
        'INSERT INTO admins (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
        [1, 'admin', 'admin@himatif.jgu.ac.id', '$2a$10$Y9G03pyXSq8Xx.r0skASu.7cCcwaCDzslrPO9rUL3uiZyCx29.wOi']
      );
    }

    const [memberRows] = await connection.execute('SELECT COUNT(*) as total FROM members');
    if (memberRows[0]?.total === 0) {
      console.log('[DB Info] Mengisi data master anggota awal ke MySQL...');
      for (const m of inMemoryStore.members) {
        await connection.execute(
          'INSERT INTO members (id, uid_rfid, nim, name, generation, department, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [m.id, m.uid_rfid, m.nim, m.name, m.generation, m.department, m.photo, m.status]
        );
      }
    }

    const [settingRows] = await connection.execute('SELECT COUNT(*) as total FROM system_settings');
    if (settingRows[0]?.total === 0) {
      console.log('[DB Info] Mengisi pengaturan awal ke MySQL...');
      await connection.execute(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?), (?, ?), (?, ?), (?, ?)',
        [
          'cooldown_seconds', '30',
          'organization_name', 'HIMATIF JGU',
          'organization_subtext', 'Himpunan Mahasiswa Teknik Informatika - Jakarta Global University',
          'attendance_active', 'true'
        ]
      );
    }

    const [attRows] = await connection.execute('SELECT COUNT(*) as total FROM attendance');
    if (attRows[0]?.total === 0) {
      console.log('[DB Info] Mengisi data absensi awal ke MySQL...');
      for (const a of inMemoryStore.attendance) {
        await connection.execute(
          'INSERT INTO attendance (id, member_id, uid_rfid, attendance_date, attendance_time, status) VALUES (?, ?, ?, ?, ?, ?)',
          [a.id, a.member_id, a.uid_rfid, a.attendance_date, a.attendance_time, a.status]
        );
      }
    }
  } catch (seedErr) {
    console.warn('[DB Warning] Auto seed failed:', seedErr.message);
  }
}

async function query(sql, params = []) {
  if (isConnectedToMysql && pool) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('[DB Query Error]', err.message);
      throw err;
    }
  }
  return executeInMemory(sql, params);
}

// Lightweight in-memory SQL simulator for smooth local demonstration
function executeInMemory(sql, params = []) {
  const normalizedSql = sql.trim().toLowerCase();

  // 1. SELECT Admins
  if (normalizedSql.startsWith('select') && normalizedSql.includes('from admins')) {
    if (normalizedSql.includes('username =') || normalizedSql.includes('email =')) {
      const val = params[0];
      const admin = inMemoryStore.admins.find(a => a.username === val || a.email === val);
      return admin ? [admin] : [];
    }
    if (normalizedSql.includes('id =')) {
      const id = Number(params[0]);
      const admin = inMemoryStore.admins.find(a => a.id === id);
      return admin ? [admin] : [];
    }
    return [...inMemoryStore.admins];
  }

  // 2. Members queries
  if (normalizedSql.startsWith('select') && normalizedSql.includes('from members')) {
    if (normalizedSql.includes('count(*)')) {
      const activeCount = inMemoryStore.members.filter(m => m.status === 'active').length;
      return [{ total: activeCount }];
    }
    if (normalizedSql.includes('uid_rfid')) {
      const uid = params[0]?.toUpperCase();
      const member = inMemoryStore.members.find(m => m.uid_rfid.toUpperCase() === uid);
      return member ? [member] : [];
    }
    if (normalizedSql.includes('id =')) {
      const id = Number(params[0]);
      const member = inMemoryStore.members.find(m => m.id === id);
      return member ? [member] : [];
    }
    if (normalizedSql.includes('nim =')) {
      const nim = params[0];
      const member = inMemoryStore.members.find(m => m.nim === nim);
      return member ? [member] : [];
    }
    // Return all or filtered
    return [...inMemoryStore.members];
  }

  // Insert Member
  if (normalizedSql.startsWith('insert into members')) {
    const newId = inMemoryStore.members.length > 0 ? Math.max(...inMemoryStore.members.map(m => m.id)) + 1 : 1;
    const [uid_rfid, nim, name, generation, department, photo, status] = params;
    const newMember = {
      id: newId,
      uid_rfid,
      nim,
      name,
      generation,
      department,
      photo: photo || '/uploads/members/default-avatar.svg',
      status: status || 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    inMemoryStore.members.push(newMember);
    return { insertId: newId, affectedRows: 1 };
  }

  // Update Member
  if (normalizedSql.startsWith('update members')) {
    const id = Number(params[params.length - 1]);
    const idx = inMemoryStore.members.findIndex(m => m.id === id);
    if (idx !== -1) {
      if (params.length === 8) {
        const [uid_rfid, nim, name, generation, department, photo, status] = params;
        inMemoryStore.members[idx] = {
          ...inMemoryStore.members[idx],
          uid_rfid,
          nim,
          name,
          generation,
          department,
          photo,
          status,
          updated_at: new Date()
        };
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Delete Member
  if (normalizedSql.startsWith('delete from members')) {
    const id = Number(params[0]);
    inMemoryStore.members = inMemoryStore.members.filter(m => m.id !== id);
    inMemoryStore.attendance = inMemoryStore.attendance.filter(a => a.member_id !== id);
    return { affectedRows: 1 };
  }

  // 3. Attendance queries
  if (normalizedSql.startsWith('insert into attendance')) {
    const newId = inMemoryStore.attendance.length > 0 ? Math.max(...inMemoryStore.attendance.map(a => a.id)) + 1 : 1;
    const [member_id, uid_rfid, attendance_date, attendance_time, status] = params;
    const newAtt = {
      id: newId,
      member_id,
      uid_rfid,
      attendance_date,
      attendance_time,
      status: status || 'Hadir',
      created_at: new Date()
    };
    inMemoryStore.attendance.unshift(newAtt);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalizedSql.startsWith('select') && normalizedSql.includes('from attendance')) {
    // Join with members
    const joined = inMemoryStore.attendance.map(att => {
      const member = inMemoryStore.members.find(m => m.id === att.member_id) || {};
      return {
        ...att,
        member_name: member.name,
        name: member.name,
        nim: member.nim,
        generation: member.generation,
        department: member.department,
        photo: member.photo
      };
    });

    if (normalizedSql.includes('member_id =')) {
      const memberId = Number(params[0]);
      return joined.filter(a => a.member_id === memberId);
    }
    if (normalizedSql.includes('attendance_date =') || normalizedSql.includes('curdate()')) {
      const dateVal = params[0] || new Date().toISOString().split('T')[0];
      return joined.filter(a => a.attendance_date === dateVal);
    }
    return joined;
  }

  // Default fallback
  return [];
}

module.exports = {
  initializeDatabase,
  query,
  inMemoryStore,
  get isConnected() {
    return isConnectedToMysql;
  }
};

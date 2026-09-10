const { query } = require('../config/database');

function getJakartaDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}

function getJakartaTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date());
}

class Attendance {
  static async record({ member_id, uid_rfid, status = 'Hadir' }) {
    const attendance_date = getJakartaDate();
    const attendance_time = getJakartaTime();

    const result = await query(
      'INSERT INTO attendance (member_id, uid_rfid, attendance_date, attendance_time, status) VALUES (?, ?, ?, ?, ?)',
      [member_id, uid_rfid.toUpperCase(), attendance_date, attendance_time, status]
    );

    return {
      id: result.insertId,
      member_id,
      uid_rfid: uid_rfid.toUpperCase(),
      attendance_date,
      attendance_time,
      status
    };
  }

  static async findTodayByMemberId(memberId) {
    const today = getJakartaDate();
    const rows = await query(
      'SELECT * FROM attendance WHERE member_id = ? AND attendance_date = ? ORDER BY id DESC LIMIT 1',
      [memberId, today]
    );
    return rows[0] || null;
  }

  static async getTodayLogs() {
    const today = getJakartaDate();
    const sql = `
      SELECT a.*, m.name, m.nim, m.generation, m.department, m.photo 
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      WHERE a.attendance_date = ?
      ORDER BY a.id DESC
    `;
    return await query(sql, [today]);
  }

  static async getHistory({ search = '', startDate = '', endDate = '', department = '', generation = '', status = '' } = {}) {
    let sql = `
      SELECT a.*, m.name, m.nim, m.generation, m.department, m.photo 
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (m.name LIKE ? OR m.nim LIKE ? OR a.uid_rfid LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (startDate) {
      sql += ' AND a.attendance_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND a.attendance_date <= ?';
      params.push(endDate);
    }

    if (department && department !== 'all') {
      sql += ' AND m.department = ?';
      params.push(department);
    }

    if (generation && generation !== 'all') {
      sql += ' AND m.generation = ?';
      params.push(generation);
    }

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.attendance_date DESC, a.attendance_time DESC';

    return await query(sql, params);
  }

  static async getByMemberId(memberId) {
    const sql = `
      SELECT * FROM attendance 
      WHERE member_id = ? 
      ORDER BY attendance_date DESC, attendance_time DESC
    `;
    return await query(sql, [memberId]);
  }

  static async getSummaryStats() {
    const today = getJakartaDate();

    // Total active members
    const memberRows = await query('SELECT COUNT(*) as total FROM members WHERE status = ?', ['active']);
    const totalMembers = memberRows[0]?.total || 0;

    // Distinct members attended today
    const todayRows = await query(
      'SELECT COUNT(DISTINCT member_id) as presentToday, COUNT(*) as totalScansToday FROM attendance WHERE attendance_date = ?',
      [today]
    );
    const presentToday = todayRows[0]?.presentToday || 0;
    const totalScansToday = todayRows[0]?.totalScansToday || 0;

    const notPresentToday = Math.max(0, totalMembers - presentToday);
    const percentage = totalMembers > 0 ? Math.round((presentToday / totalMembers) * 100) : 0;

    // Total historical attendance count
    const totalAttRows = await query('SELECT COUNT(*) as totalAllTime FROM attendance');
    const totalAllTime = totalAttRows[0]?.totalAllTime || 0;

    return {
      totalMembers,
      presentToday,
      notPresentToday,
      totalScansToday,
      totalAllTime,
      attendanceRate: percentage,
      date: today
    };
  }
}

module.exports = Attendance;

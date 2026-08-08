const { query } = require('../config/database');

class Member {
  static async findAll({ search = '', department = '', generation = '', status = '' } = {}) {
    let sql = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR nim LIKE ? OR uid_rfid LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department && department !== 'all') {
      sql += ' AND department = ?';
      params.push(department);
    }

    if (generation && generation !== 'all') {
      sql += ' AND generation = ?';
      params.push(generation);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';

    const rows = await query(sql, params);
    return rows;
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM members WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async findByUid(uid) {
    if (!uid) return null;
    const normalizedUid = uid.trim().toUpperCase();
    const rows = await query('SELECT * FROM members WHERE UPPER(uid_rfid) = ? LIMIT 1', [normalizedUid]);
    return rows[0] || null;
  }

  static async findByNim(nim) {
    if (!nim) return null;
    const rows = await query('SELECT * FROM members WHERE nim = ? LIMIT 1', [nim.trim()]);
    return rows[0] || null;
  }

  static async create({ uid_rfid, nim, name, generation, department, photo, status = 'active' }) {
    const normalizedUid = uid_rfid.trim().toUpperCase();
    const result = await query(
      'INSERT INTO members (uid_rfid, nim, name, generation, department, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [normalizedUid, nim.trim(), name.trim(), generation.trim(), department.trim(), photo, status]
    );
    return result.insertId;
  }

  static async update(id, { uid_rfid, nim, name, generation, department, photo, status }) {
    const current = await this.findById(id);
    if (!current) return null;

    const normalizedUid = (uid_rfid || current.uid_rfid).trim().toUpperCase();
    const finalPhoto = photo || current.photo;

    await query(
      'UPDATE members SET uid_rfid = ?, nim = ?, name = ?, generation = ?, department = ?, photo = ?, status = ? WHERE id = ?',
      [
        normalizedUid,
        (nim || current.nim).trim(),
        (name || current.name).trim(),
        (generation || current.generation).trim(),
        (department || current.department).trim(),
        finalPhoto,
        status || current.status,
        id
      ]
    );
    return await this.findById(id);
  }

  static async delete(id) {
    return await query('DELETE FROM members WHERE id = ?', [id]);
  }

  static async count() {
    const rows = await query('SELECT COUNT(*) as total FROM members WHERE status = "active"');
    return rows[0]?.total || 0;
  }
}

module.exports = Member;

const { query } = require('../config/database');

class Admin {
  static async findByUsernameOrEmail(identifier) {
    const rows = await query(
      'SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const rows = await query(
      'SELECT id, username, email, created_at FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  static async updatePassword(id, hashedPassword) {
    return await query(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }
}

module.exports = Admin;

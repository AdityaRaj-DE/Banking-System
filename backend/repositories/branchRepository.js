import pool from '../config/db.js';

class BranchRepository {
  async create(branchData) {
    const { branch_name, location } = branchData;
    const [result] = await pool.query(
      'INSERT INTO branch (branch_name, location) VALUES (?, ?)',
      [branch_name, location]
    );
    return result.insertId;
  }

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM branch');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM branch WHERE branch_id = ?', [id]);
    return rows[0];
  }

  async delete(id) {
    const [result] = await pool.query('DELETE FROM branch WHERE branch_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new BranchRepository();

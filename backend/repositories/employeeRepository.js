import pool from '../config/db.js';

class EmployeeRepository {
  async create(employeeData) {
    const { name, role, branch_id } = employeeData;
    const [result] = await pool.query(
      'INSERT INTO employees (name, role, branch_id) VALUES (?, ?, ?)',
      [name, role, branch_id]
    );
    return result.insertId;
  }

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM employees');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
    return rows[0];
  }

  async findByBranchId(branchId) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE branch_id = ?', [branchId]);
    return rows;
  }

  async delete(id) {
    const [result] = await pool.query('DELETE FROM employees WHERE employee_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new EmployeeRepository();

import pool from '../config/db.js';

class CustomerRepository {
  async create(customerData) {
    const { name, email, password, phone, address } = customerData;
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone, address]
    );
    return result.insertId;
  }

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    return rows[0];
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT customer_id, name, email, phone, address, created_at FROM customers WHERE customer_id = ?', [id]);
    return rows[0];
  }

  async findAll() {
    const [rows] = await pool.query('SELECT customer_id, name, email, phone, address, created_at FROM customers');
    return rows;
  }

  async update(id, customerData) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(customerData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const [result] = await pool.query(`UPDATE customers SET ${fields.join(', ')} WHERE customer_id = ?`, values);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.query('DELETE FROM customers WHERE customer_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new CustomerRepository();

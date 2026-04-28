import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const schema = [
  `CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_type ENUM('savings','current') NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    status ENUM('active','blocked','closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    from_account INT,
    to_account INT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    transaction_type ENUM('deposit','withdraw','transfer') NOT NULL,
    status ENUM('pending','completed','failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (to_account) REFERENCES accounts(account_id) ON DELETE SET NULL
  );`,

  `CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50),
    table_name VARCHAR(50),
    performed_by INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  // Indexes
  `CREATE INDEX idx_customer_email ON customers(email);`,
  `CREATE INDEX idx_account_customer ON accounts(customer_id);`,
  `CREATE INDEX idx_transaction_accounts ON transactions(from_account, to_account);`
];

const procedures = [
  `DROP PROCEDURE IF EXISTS TransferMoney;`,
  `CREATE PROCEDURE TransferMoney(
    IN sender_id INT,
    IN receiver_id INT,
    IN transfer_amount DECIMAL(12,2)
  )
  BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
    IF (SELECT balance FROM accounts WHERE account_id = sender_id FOR UPDATE) < transfer_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;
    UPDATE accounts SET balance = balance - transfer_amount WHERE account_id = sender_id;
    UPDATE accounts SET balance = balance + transfer_amount WHERE account_id = receiver_id;
    INSERT INTO transactions (from_account, to_account, amount, transaction_type, status)
    VALUES (sender_id, receiver_id, transfer_amount, 'transfer', 'completed');
    COMMIT;
  END;`,
  `DROP PROCEDURE IF EXISTS DepositMoney;`,
  `CREATE PROCEDURE DepositMoney(
    IN acc_id INT,
    IN dep_amount DECIMAL(12,2)
  )
  BEGIN
    START TRANSACTION;
    UPDATE accounts SET balance = balance + dep_amount WHERE account_id = acc_id;
    INSERT INTO transactions (to_account, amount, transaction_type, status)
    VALUES (acc_id, dep_amount, 'deposit', 'completed');
    COMMIT;
  END;`
];

const triggers = [
  `DROP TRIGGER IF EXISTS after_transaction_insert;`,
  `CREATE TRIGGER after_transaction_insert
  AFTER INSERT ON transactions
  FOR EACH ROW
  BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'transactions', NEW.from_account);
  END;`,
  `DROP TRIGGER IF EXISTS after_customer_insert;`,
  `CREATE TRIGGER after_customer_insert
  AFTER INSERT ON customers
  FOR EACH ROW
  BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'customers', NEW.customer_id);
  END;`,
  `DROP TRIGGER IF EXISTS after_account_insert;`,
  `CREATE TRIGGER after_account_insert
  AFTER INSERT ON accounts
  FOR EACH ROW
  BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'accounts', NEW.customer_id);
  END;`,
  `DROP TRIGGER IF EXISTS after_customer_update;`,
  `CREATE TRIGGER after_customer_update
  AFTER UPDATE ON customers
  FOR EACH ROW
  BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('UPDATE', 'customers', NEW.customer_id);
  END;`
];

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('Connecting to MySQL...');
  
  const dbName = process.env.DB_NAME || 'banking_system';
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  await connection.query(`USE ${dbName}`);
  
  console.log(`Using database: ${dbName}`);

  console.log('Creating tables...');
  for (const sql of schema) {
    try {
      await connection.query(sql);
    } catch (e) {
      console.warn(`Warning while running schema: ${e.message}`);
    }
  }

  console.log('Fixing existing accounts and ensuring NOT NULL constraints...');
  try {
    await connection.query(`UPDATE accounts SET balance = 0 WHERE balance IS NULL`);
    await connection.query(`ALTER TABLE accounts MODIFY balance DECIMAL(12,2) NOT NULL DEFAULT 0`);
    console.log('Account table constraints fixed.');
  } catch (e) {
    console.warn(`Warning while fixing accounts: ${e.message}`);
  }

  console.log('Creating procedures...');
  for (const sql of procedures) {
    await connection.query(sql);
  }

  console.log('Creating triggers...');
  for (const sql of triggers) {
    await connection.query(sql);
  }

  console.log('Database initialized successfully!');
  await connection.end();
}


init().catch(err => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});

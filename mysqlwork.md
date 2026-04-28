# MySQL Setup for Banking System

Run these queries in your MySQL Workbench (Port 3307).

## 1. Database Creation
```sql
CREATE DATABASE IF NOT EXISTS banking_system;
USE banking_system;
```

## 2. Improved Schema
```sql
-- Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Added for JWT Auth
    phone VARCHAR(15) UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Table
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_type ENUM('savings','current') NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0 CHECK (balance >= 0),
    status ENUM('active','blocked','closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    from_account INT,
    to_account INT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    transaction_type ENUM('deposit','withdraw','transfer') NOT NULL,
    status ENUM('pending','completed','failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (to_account) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Branch Table
CREATE TABLE branch (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL
);

-- Employees Table
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE SET NULL
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50),
    table_name VARCHAR(50),
    performed_by INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Indexes & Optimization
```sql
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_account_customer ON accounts(customer_id);
CREATE INDEX idx_transaction_accounts ON transactions(from_account, to_account);
```

## 4. Stored Procedures
```sql
DELIMITER //

-- Procedure to handle Transfers with Transaction Logic
CREATE PROCEDURE TransferMoney(
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
    
    -- Check balance and lock row for update
    IF (SELECT balance FROM accounts WHERE account_id = sender_id FOR UPDATE) < transfer_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;

    -- Deduct from sender
    UPDATE accounts SET balance = balance - transfer_amount WHERE account_id = sender_id;
    
    -- Add to receiver
    UPDATE accounts SET balance = balance + transfer_amount WHERE account_id = receiver_id;
    
    -- Record transaction
    INSERT INTO transactions (from_account, to_account, amount, transaction_type, status)
    VALUES (sender_id, receiver_id, transfer_amount, 'transfer', 'completed');
    
    COMMIT;
END //

-- Procedure for Deposit
CREATE PROCEDURE DepositMoney(
    IN acc_id INT,
    IN dep_amount DECIMAL(12,2)
)
BEGIN
    START TRANSACTION;
    UPDATE accounts SET balance = balance + dep_amount WHERE account_id = acc_id;
    INSERT INTO transactions (to_account, amount, transaction_type, status)
    VALUES (acc_id, dep_amount, 'deposit', 'completed');
    COMMIT;
END //

DELIMITER ;
```

## 5. Triggers for Audit Logging
```sql
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'transactions', NEW.from_account);
END;

CREATE TRIGGER after_customer_update
AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('UPDATE', 'customers', NEW.customer_id);
END;
```

## 6. Backup & Recovery
To take a backup:
```powershell
mysqldump -u root -p --port=3307 banking_system > backup.sql
```

To restore:
```powershell
mysql -u root -p --port=3307 banking_system < backup.sql
```

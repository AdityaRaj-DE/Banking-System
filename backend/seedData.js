import pool from './config/db.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('Starting seeding process...');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const customers = [];
    for (let i = 0; i < 20; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email().toLowerCase();
      // Ensure email is unique by appending index if needed, though faker is usually good
      const phone = faker.string.numeric(10); // Simple 10 digit number for phone
      const address = faker.location.streetAddress() + ', ' + faker.location.city();
      
      try {
        const [result] = await connection.query(
          'INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
          [name, email, defaultPassword, phone, address]
        );
        customers.push({ id: result.insertId, name });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            // Retry with a slightly different email if duplicate
            const [result] = await connection.query(
                'INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
                [name, `user${i}_${email}`, defaultPassword, faker.string.numeric(10), address]
            );
            customers.push({ id: result.insertId, name });
        } else {
            throw err;
        }
      }
    }
    console.log(`Inserted 20 customers.`);

    const accounts = [];
    for (const customer of customers) {
      // Every user gets a savings account
      const [savingsResult] = await connection.query(
        'INSERT INTO accounts (customer_id, account_type, balance) VALUES (?, ?, ?)',
        [customer.id, 'savings', 0]
      );
      accounts.push({ id: savingsResult.insertId, type: 'savings' });

      // 50% chance of a current account
      if (Math.random() > 0.5) {
        const [currentResult] = await connection.query(
          'INSERT INTO accounts (customer_id, account_type, balance) VALUES (?, ?, ?)',
          [customer.id, 'current', 0]
        );
        accounts.push({ id: currentResult.insertId, type: 'current' });
      }
    }
    console.log(`Inserted ${accounts.length} accounts.`);

    // Initial deposits
    console.log('Depositing initial funds...');
    for (const account of accounts) {
      const depositAmount = parseFloat(faker.finance.amount({ min: 1000, max: 50000, dec: 2 }));
      await connection.query('CALL DepositMoney(?, ?)', [account.id, depositAmount]);
    }
    console.log(`Completed initial deposits for all accounts.`);

    // Random transfers
    console.log('Generating 50 random transfers...');
    for (let i = 0; i < 50; i++) {
      const fromIdx = Math.floor(Math.random() * accounts.length);
      let toIdx = Math.floor(Math.random() * accounts.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * accounts.length);
      }

      const fromAccount = accounts[fromIdx];
      const toAccount = accounts[toIdx];

      // Get current balance of fromAccount
      const [rows] = await connection.query('SELECT balance FROM accounts WHERE account_id = ?', [fromAccount.id]);
      const balance = parseFloat(rows[0].balance);
      
      if (balance > 100) {
        const transferAmount = parseFloat(faker.finance.amount({ min: 10, max: balance / 2, dec: 2 }));
        try {
          await connection.query('CALL TransferMoney(?, ?, ?)', [fromAccount.id, toAccount.id, transferAmount]);
        } catch (err) {
          // console.warn(`Transfer ${i} failed: ${err.message}`);
        }
      }
    }
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();

import accountService from './services/accountService.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  try {
    const customerId = 'undefined';
    console.log(`Checking stats for customer ${customerId}...`);
    const stats = await accountService.getCustomerStats(customerId);
    console.log("Stats result:", stats);
  } catch (err) {
    console.log("Caught Error status:", err.status);
    console.log("Caught Error message:", err.message);
  } finally {
    process.exit(0);
  }
}

check();

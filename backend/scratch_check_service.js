import accountService from './services/accountService.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  try {
    const customerId = 1;
    console.log(`Checking stats for customer ${customerId}...`);
    const stats = await accountService.getCustomerStats(customerId);
    console.log("Stats result:", stats);
  } catch (err) {
    console.error("Error in accountService:", err);
  } finally {
    process.exit(0);
  }
}

check();

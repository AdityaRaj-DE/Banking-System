import adminRepository from '../repositories/adminRepository.js';
import { exec } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class AdminService {
  async getAuditLogs() {
    return await adminRepository.getAuditLogs();
  }

  async analyzeQuery(query) {
    if (!query) {
      const error = new Error('Query is required');
      error.status = 400;
      throw error;
    }
    return await adminRepository.analyzeQuery(query);
  }

  async backupDatabase() {
    const dbName = process.env.DB_NAME || 'banking_system';
    const dbUser = process.env.DB_USER || 'root';
    const dbPass = process.env.DB_PASSWORD || 'Root@12345';
    const dbPort = process.env.DB_PORT || 3307;
    const backupPath = path.join(process.cwd(), 'backup.sql');

    return new Promise((resolve, reject) => {
      // Note: This requires mysqldump to be in the PATH
      const command = `mysqldump -u ${dbUser} -p${dbPass} --port=${dbPort} ${dbName} > "${backupPath}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Backup error: ${error.message}`);
          return reject(new Error('Backup failed. Ensure mysqldump is installed.'));
        }
        resolve({ message: 'Backup created successfully', path: backupPath });
      });
    });
  }

  async restoreDatabase() {
    const dbName = process.env.DB_NAME || 'banking_system';
    const dbUser = process.env.DB_USER || 'root';
    const dbPass = process.env.DB_PASSWORD || 'Root@12345';
    const dbPort = process.env.DB_PORT || 3307;
    const backupPath = path.join(process.cwd(), 'backup.sql');

    return new Promise((resolve, reject) => {
      // Note: This requires mysql client to be in the PATH
      const command = `mysql -u ${dbUser} -p${dbPass} --port=${dbPort} ${dbName} < "${backupPath}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Restore error: ${error.message}`);
          return reject(new Error('Restore failed. Ensure mysql client is installed and backup.sql exists.'));
        }
        resolve({ message: 'Database restored successfully' });
      });
    });
  }
}

export default new AdminService();

import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './Admin.css';

const AdminPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminService.getAuditLogs();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const res = await adminService.backup();
      setDbStatus(res.message);
      alert('Backup created at: ' + res.data.path);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm('Are you sure? This will overwrite the current database!')) return;
    setLoading(true);
    try {
      const res = await adminService.restore();
      setDbStatus(res.message);
      alert('Database restored successfully!');
      fetchLogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryAnalysis = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.analyzeQuery(query);
      setQueryResult(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page fade-in">
      <header className="page-header">
        <h1>Admin Control Center</h1>
        <p className="subtitle">Database management and system audit logs</p>
      </header>

      <div className="admin-grid">
        <section className="db-tools glass-panel">
          <h3>DBMS Tools</h3>
          <div className="tool-buttons">
            <button onClick={handleBackup} className="secondary-btn" disabled={loading}>Backup Database</button>
            <button onClick={handleRestore} className="secondary-btn" disabled={loading}>Restore Database</button>
          </div>
          {dbStatus && <p className="status-msg">{dbStatus}</p>}

          <div className="query-analyzer">
            <h4>Query Performance Analyzer</h4>
            <form onSubmit={handleQueryAnalysis}>
              <textarea 
                className="glass-input" 
                placeholder="EXPLAIN SELECT * FROM transactions..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="primary-btn">Analyze</button>
            </form>
            {queryResult && (
              <pre className="query-result">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            )}
          </div>
        </section>

        <section className="audit-logs glass-panel">
          <h3>System Audit Logs</h3>
          <div className="logs-container">
            {logs.map(log => (
              <div key={log.log_id} className="log-item">
                <span className="log-time">{new Date(log.timestamp).toLocaleString()}</span>
                <span className="log-action">{log.action}</span>
                <span className="log-table">in {log.table_name}</span>
                <span className="log-user">by UID: {log.performed_by}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;

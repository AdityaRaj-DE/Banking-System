import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';

const EmployeePanel = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, branchRes] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getBranches()
      ]);
      setEmployees(empRes.data);
      setBranches(branchRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-page fade-in">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Branch & Employee Management</h1>
        <p className="subtitle">Overview of bank operations and staff</p>
      </header>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Branches</h3>
          <div style={{ marginTop: '1rem' }}>
            {branches.map(branch => (
              <div key={branch.branch_id} className="log-item" style={{ marginBottom: '0.5rem', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>{branch.branch_name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{branch.location}</span>
              </div>
            ))}
            {branches.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No branches found.</p>}
          </div>
        </section>

        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Employees</h3>
          <div style={{ marginTop: '1rem' }}>
            {employees.map(emp => (
              <div key={emp.employee_id} className="log-item" style={{ marginBottom: '0.5rem', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>{emp.name}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.role}</p>
                </div>
                <span className="badge badge-primary">Branch #{emp.branch_id}</span>
              </div>
            ))}
            {employees.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No employees found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeePanel;

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import adminService from '../services/adminService';
import './AnalyticsPage.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await adminService.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Analytics...</div>;
  if (!data) return <div className="error">Failed to load analytics data.</div>;

  const summary = data.summary[0];

  return (
    <div className="analytics-page fade-in">
      <header className="page-header">
        <h1>System Analytics</h1>
        <p className="subtitle">Real-time insights across all users and accounts</p>
      </header>

      {/* KPI Cards */}
      <div className="analytics-grid">
        <div className="kpi-card glass-panel">
          <span className="label">Total Customers</span>
          <span className="value">{summary.total_customers}</span>
        </div>
        <div className="kpi-card glass-panel">
          <span className="label">Total Accounts</span>
          <span className="value">{summary.total_accounts}</span>
        </div>
        <div className="kpi-card glass-panel">
          <span className="label">Total Balance</span>
          <span className="value">${parseFloat(summary.total_balance || 0).toLocaleString()}</span>
        </div>
        <div className="kpi-card glass-panel">
          <span className="label">Transaction Volume</span>
          <span className="value">${parseFloat(summary.total_volume || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="charts-container">
        {/* Timeline Chart */}
        <div className="chart-card glass-panel full-width">
          <h3>Transaction History (30 Days)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.transactionsTimeline}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Types Pie Chart */}
        <div className="chart-card glass-panel">
          <h3>Transaction Breakdown</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.transactionsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="transaction_type"
                >
                  {data.transactionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Types Bar Chart */}
        <div className="chart-card glass-panel">
          <h3>Account Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.accountsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="account_type" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

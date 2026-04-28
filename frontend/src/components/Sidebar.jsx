import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">NB</div>
        <h2>Nexus Bank</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Transactions</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>History</span>
        </NavLink>
        
        <div className="nav-separator">ADMIN</div>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Admin Panel</span>
        </NavLink>
        <NavLink to="/employee" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Employee Panel</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;

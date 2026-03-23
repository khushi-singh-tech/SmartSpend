
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authentication';

const Sidebar = () => {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const showSidebar = !['/login', '/register'].includes(location.pathname);

  if (!showSidebar) {
    return null;
  }

  return (
    <div className="sidebar bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh', position: 'fixed', top: '56px', left: '0', bottom: '0', zIndex: '100' }}>
      <h4 className="mb-4">📊 Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className={`nav-link text-white ${isActive('/')}`} to="/">
            <span className="me-2"></span> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link text-white ${isActive('/transactions')}`} to="/transactions">
            <span className="me-2"></span> Transactions
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link text-white ${isActive('/budgets')}`} to="/budgets">
            <span className="me-2"></span> Budgets
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link text-white ${isActive('/reports')}`} to="/reports">
            <span className="me-2"></span> Reports
          </Link>
        </li>
        {user && user.role === 'ADMIN' && (
          <li className="nav-item">
            <Link className={`nav-link text-white ${isActive('/admin')}`} to="/admin">
              <span className="me-2"></span> Admin Panel
            </Link>
          </li>
        )}
       
      </ul>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';
import AdminProducts from './Products';
import { isAuthenticated, removeToken } from '../../utils/auth';

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [page, setPage] = useState('dashboard');

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={() => setPage('dashboard')}>Dashboard</button>
      <button onClick={() => setPage('products')}>Products</button>
      <button onClick={() => { removeToken(); setLoggedIn(false); }}>Logout</button>
      <div>
        {page === 'dashboard' && <AdminDashboard />}
        {page === 'products' && <AdminProducts />}
      </div>
    </div>
  );
}
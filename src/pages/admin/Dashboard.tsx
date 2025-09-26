import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { getToken, clearToken } from '../../utils/auth';
import AnalyticsChart from '../../components/admin/AnalyticsChart';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<{ totalSales: number; bestSellers: any[] } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/dashboard/sales', 'GET', undefined, getToken()!)
      .then(setAnalytics)
      .catch(e => setError(e.message));
  }, []);

  function handleLogout() {
    clearToken();
    window.location.href = '/admin/login';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <div className="p-6">
        {error && <p className="text-red-500">{error}</p>}
        {analytics ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold">Total Sales: ${analytics.totalSales}</h2>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
              <ul>
                {analytics.bestSellers.map(p => (
                  <li key={p._id} className="mb-2">
                    <strong>{p.name}</strong> — Sold: {p.sold}
                  </li>
                ))}
              </ul>
            </div>
            <AnalyticsChart data={analytics.bestSellers} />
          </>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
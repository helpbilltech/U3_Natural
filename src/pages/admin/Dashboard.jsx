import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../utils/api';
import { getToken } from '../../utils/auth';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import SalesCharts from '../../components/SalesCharts';

export default function AdminDashboard() {
  const [data, setData] = useState({ totalSales: 0, bestSellers: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await getAnalytics(getToken());
        if (!res || res.error || res.status === 401) {
          setError('Unauthorized. Please log in again.');
          return;
        }
        setData({ totalSales: res.totalSales || 0, bestSellers: Array.isArray(res.bestSellers) ? res.bestSellers : [] });
      } catch (e) {
        setError('Failed to load analytics.');
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.section
        className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <motion.img
          src={logo}
          alt="U3 Admin Logo"
          className="w-20 h-20 mb-2 rounded-full shadow"
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: [0.95, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        />
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--rose-600)] mb-1">Sales Dashboard</h2>
            <div className="text-[#171717] text-lg">Comprehensive analytics and insights</div>
          </div>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </motion.button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
      </motion.section>

      {/* Sales Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <SalesCharts />
      </motion.div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { getAnalytics } from '../utils/api';
import { getToken } from '../utils/auth';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SalesCharts() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    bestSellers: [],
    salesByMonth: [],
    ordersByStatus: {},
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      if (!token) {
        setError('Please log in to view analytics');
        return;
      }

      const data = await getAnalytics(token);
      console.log('Analytics data received:', data);
      
      if (data.error) {
        setError(data.message || 'Failed to fetch analytics data');
        return;
      }

      // Ensure we have default values for all analytics data
      setAnalytics({
        totalSales: data.totalSales || 0,
        totalOrders: data.totalOrders || 0,
        avgOrderValue: data.avgOrderValue || 0,
        salesByMonth: data.salesByMonth || [],
        bestSellers: data.bestSellers || [],
        ordersByStatus: data.ordersByStatus || {},
        recentOrders: data.recentOrders || [],
        dailySales: data.dailySales || [],
        categoryPerformance: data.categoryPerformance || []
      });
    } catch (err) {
      console.error('Analytics error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError('Failed to fetch analytics data. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rose-500)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <motion.button
          onClick={fetchAnalytics}
          className="bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-6 py-2 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      </div>
    );
  }

  // Chart configurations
  const salesData = {
    labels: analytics.salesByMonth?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Sales (ETB)',
        data: analytics.salesByMonth?.map(item => item.sales) || [],
        borderColor: 'rgb(217, 136, 147)',
        backgroundColor: 'rgba(217, 136, 147, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bestSellersData = {
    labels: analytics.bestSellers?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: analytics.bestSellers?.map(item => item.sales) || [],
        backgroundColor: [
          'rgba(217, 136, 147, 0.8)',
          'rgba(192, 106, 117, 0.8)',
          'rgba(255, 182, 193, 0.8)',
          'rgba(255, 192, 203, 0.8)',
        ],
        borderColor: [
          'rgb(217, 136, 147)',
          'rgb(192, 106, 117)',
          'rgb(255, 182, 193)',
          'rgb(255, 192, 203)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const statusData = {
    labels: analytics.ordersByStatus ? Object.keys(analytics.ordersByStatus).map(status => 
      status.charAt(0).toUpperCase() + status.slice(1)
    ) : [],
    datasets: [
      {
        data: analytics.ordersByStatus ? Object.values(analytics.ordersByStatus) : [],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',   // pending - yellow
          'rgba(0, 123, 255, 0.8)',    // confirmed - blue
          'rgba(102, 16, 242, 0.8)',  // shipped - purple
          'rgba(40, 167, 69, 0.8)',   // delivered - green
          'rgba(220, 53, 69, 0.8)',   // cancelled - red
        ],
        borderColor: [
          'rgb(255, 193, 7)',
          'rgb(0, 123, 255)',
          'rgb(102, 16, 242)',
          'rgb(40, 167, 69)',
          'rgb(220, 53, 69)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6B7280'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-[var(--rose-600)]">
                {analytics.totalSales?.toLocaleString() || 0} ETB
              </p>
            </div>
            <div className="w-12 h-12 bg-[var(--rose-100)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--rose-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-[var(--rose-600)]">
                {analytics.totalOrders || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-[var(--rose-100)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--rose-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-[var(--rose-600)]">
                {analytics.avgOrderValue ? Math.round(analytics.avgOrderValue).toLocaleString() : 0} ETB
              </p>
            </div>
            <div className="w-12 h-12 bg-[var(--rose-100)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--rose-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
          <div className="h-80">
            <Line data={salesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Best Sellers Chart */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Sellers</h3>
          <div className="h-80">
            <Bar data={bestSellersData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ boxShadow: 'var(--soft-shadow)' }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {analytics.recentOrders?.map((order, index) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <div>
                  <p className="font-medium text-gray-800">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--rose-600)]">{order.amount} ETB</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

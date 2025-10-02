import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '../../utils/auth';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <motion.section
        className="bg-white rounded-3xl shadow-lg p-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--rose-500)]"></div>
          <p className="mt-4 text-[#6b7280]">Loading orders...</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="bg-white rounded-3xl shadow-lg p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ boxShadow: 'var(--soft-shadow)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[var(--rose-600)]">Order Management</h2>
        <button 
          onClick={fetchOrders}
          className="bg-[var(--rose-500)] hover:bg-[var(--rose-600)] text-white px-4 py-2 rounded-full text-sm font-semibold transition"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#6b7280] text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">Total: {order.total?.toFixed(2)} ETB</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Order ID: {order._id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {order.customerInfo?.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {order.customerInfo?.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {order.customerInfo?.phone || 'N/A'}</p>
                      <p><strong>Address:</strong> {order.customerInfo?.address || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Details</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Total:</strong> {order.total?.toFixed(2) || '0.00'} ETB</p>
                      <p><strong>Items:</strong> {order.products?.length || 0}</p>
                      {order.paymentScreenshot && (
                        <div>
                          <strong>Payment Screenshot:</strong>
                          <a 
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${order.paymentScreenshot}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--rose-600)] hover:underline ml-1"
                          >
                            View Screenshot
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Products</h4>
                  <div className="space-y-2">
                    {order.products?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                        <div>
                          <span className="font-medium">{item.name || 'Product'}</span>
                          <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}

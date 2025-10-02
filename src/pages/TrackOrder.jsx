import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Order not found');
        setOrder(null);
      }
    } catch (err) {
      setError('Failed to fetch order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-[var(--soft-bg)] py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-[#171717] mb-4">Track Your Order</h1>
            <p className="text-lg text-[#666]">Enter your order ID to check the status of your order</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ boxShadow: 'var(--soft-shadow)' }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., 68dbcd550961b4eb266cdca6)"
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent transition"
              />
              <motion.button
                onClick={trackOrder}
                disabled={loading}
                className="bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-8 py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-100 text-red-700 p-4 rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {loading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {order && (
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ boxShadow: 'var(--soft-shadow)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#171717] mb-2">Order Details</h2>
                  <p className="text-gray-600">Order ID: {order._id}</p>
                  <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#171717] mb-3">Customer Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {order.customerInfo?.name}</p>
                    <p><strong>Email:</strong> {order.customerInfo?.email}</p>
                    <p><strong>Phone:</strong> {order.customerInfo?.phone}</p>
                    <p><strong>Address:</strong> {order.customerInfo?.address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#171717] mb-3">Order Summary</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Total Amount:</strong> {order.total?.toFixed(2)} ETB</p>
                    <p><strong>Items:</strong> {order.products?.length || 0}</p>
                    {order.paymentScreenshot && (
                      <p><strong>Payment:</strong> <span className="text-green-600">✓ Screenshot uploaded</span></p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#171717] mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.products?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold">{item.name || item.product?.name}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[var(--rose-600)]">
                        {((item.price || item.product?.price || 0) * item.quantity).toFixed(2)} ETB
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--rose-50)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-[#171717] mb-4">Order Status Timeline</h3>
                <div className="space-y-4">
                  {['pending', 'confirmed', 'shipped', 'delivered'].map((status, index) => (
                    <div key={status} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.status) >= index
                          ? 'bg-[var(--rose-600)]'
                          : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <p className={`font-semibold ${
                          order.status === status ? 'text-[var(--rose-600)]' : 'text-gray-600'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.status === status ? 'Current status' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <Footer />
    </>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [message, setMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleOrderPlaced = (order) => {
    setMessage(`Order placed successfully! Your Order ID is: ${order._id}. We will confirm your payment and process your order.`);
    // Don't auto-redirect, let user manually navigate
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId).then(() => {
      alert('Order ID copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Order ID copied to clipboard!');
    });
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-2xl mx-auto py-10 px-6 bg-white rounded-3xl shadow-lg mt-10"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <h1 className="text-3xl font-bold mb-6 text-[#171717]">Your Cart</h1>
        {cart.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-lg text-[#888] mb-4">Your cart is empty.</div>
            <motion.button
              onClick={() => navigate('/products')}
              className="bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-6 py-2 rounded-full font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🛍️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-[var(--rose-600)] font-bold">{item.price} ETB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <motion.button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="bg-[var(--rose-50)] rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[var(--rose-600)]">{getCartTotal().toFixed(2)} ETB</span>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                onClick={() => setShowCheckout(true)}
                className="flex-1 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-8 py-3 rounded-full shadow font-semibold text-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Checkout
              </motion.button>
              <motion.button
                onClick={clearCart}
                className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 font-semibold"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Clear Cart
              </motion.button>
            </div>
          </>
        )}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800">Order Placed Successfully!</h3>
            </div>
            <p className="text-green-700 mb-4">
              We will confirm your payment and process your order.
            </p>
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Order ID:</p>
                  <p className="text-lg font-mono font-bold text-gray-800">{message.split('Order ID is: ')[1]?.split('.')[0]}</p>
                </div>
                <motion.button
                  onClick={() => copyOrderId(message.split('Order ID is: ')[1]?.split('.')[0])}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy ID
                </motion.button>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <motion.button
                onClick={() => navigate('/track-order')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Track Your Order
              </motion.button>
              <motion.button
                onClick={() => {
                  setMessage('');
                  navigate('/');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
        onOrderPlaced={handleOrderPlaced}
      />
      <Footer />
    </>
  );
}
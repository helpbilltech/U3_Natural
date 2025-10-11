import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
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
        className="max-w-6xl mx-auto py-10 px-4 bg-white rounded-3xl shadow-lg mt-10"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <h1 className="text-3xl font-bold mb-8 text-[#8b5b60]">Your Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-6">🛒</div>
            <div className="text-xl text-[#888] mb-6">Your cart is empty.</div>
            <motion.button
              onClick={() => navigate('/products')}
              className="bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-8 py-3 rounded-full font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-[#f0f0f0]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 w-32 h-32 bg-white rounded-xl flex items-center justify-center p-4">
                      <span className="text-4xl">🛍️</span>
                    </div>
                    
                    <div className="flex-grow w-full">
                      <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                      <p className="text-[var(--rose-600)] font-bold text-xl mb-4">{item.price} ETB</p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-lg font-bold"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              -
                            </motion.button>
                            <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                            <motion.button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-lg font-bold"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="text-lg font-bold">
                          Total: {(item.price * item.quantity).toFixed(2)} ETB
                        </div>
                        
                        <motion.button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="bg-gradient-to-r from-[#fff4f6] to-[#f8e8ea] rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-[#8b5b60] mb-2">Order Summary</h3>
                  <p className="text-gray-600">{getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in cart</p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg text-gray-600 mb-1">Subtotal</div>
                  <div className="text-3xl font-bold text-[var(--rose-600)]">{getCartTotal().toFixed(2)} ETB</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => setShowCheckout(true)}
                className="flex-1 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-8 py-4 rounded-full shadow font-bold text-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Proceed to Checkout
              </motion.button>
              <motion.button
                onClick={clearCart}
                className="px-8 py-4 rounded-full border-2 border-gray-300 hover:bg-gray-50 font-bold text-lg"
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
            className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">Order Placed Successfully!</h3>
                <p className="text-green-700">We will confirm your payment and process your order.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-green-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Order ID:</p>
                  <p className="text-2xl font-mono font-bold text-gray-800">{message.split('Order ID is: ')[1]?.split('.')[0]}</p>
                </div>
                <motion.button
                  onClick={() => copyOrderId(message.split('Order ID is: ')[1]?.split('.')[0])}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Order ID
                </motion.button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate('/track-order')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
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
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
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
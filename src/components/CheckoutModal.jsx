import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Payment Info, 2: Upload Screenshot
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('cart', JSON.stringify(cart));
      formData.append('customerInfo', JSON.stringify(customerInfo));
      if (paymentScreenshot) {
        formData.append('paymentScreenshot', paymentScreenshot);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        onOrderPlaced(order);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or JPEG)');
      return;
    }
    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setPaymentScreenshot(file);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#8b5b60]">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="bg-[#fff4f6] rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-[#8b5b60] mb-3">Bank Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Bank:</strong> U3 Natural Bank</div>
                    <div><strong>Account Number:</strong> 1234567890</div>
                    <div><strong>Account Name:</strong> U3 Natural Products</div>
                    <div><strong>Amount:</strong> {getCartTotal().toFixed(2)} ETB</div>
                    <div><strong>Reference:</strong> U3-{Date.now().toString().slice(-6)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Please transfer the exact amount to the account above and upload a screenshot of your payment receipt.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Upload Payment Screenshot</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Please upload a clear screenshot of your payment receipt showing the transfer details.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Payment Screenshot *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[var(--rose-500)] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-screenshot"
                      required
                    />
                    <label htmlFor="payment-screenshot" className="cursor-pointer">
                      {paymentScreenshot ? (
                        <div>
                          <div className="text-green-600 mb-2">✓ File selected: {paymentScreenshot.name}</div>
                          <div className="text-sm text-gray-500">Click to change file</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-2">📸</div>
                          <div className="text-gray-600">Click to upload payment screenshot</div>
                          <div className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG files only (max 5MB)</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentScreenshot}
                    className="flex-1 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
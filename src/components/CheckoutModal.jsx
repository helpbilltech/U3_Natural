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
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
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
              className="text-gray-500 hover:text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="flex items-center mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[#d98893]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 1 ? 'bg-[#d98893] text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[#d98893]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 2 ? 'bg-[#d98893] text-white' : 'bg-gray-200'}`}>
              2
            </div>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-[#8b5b60]">Payment Information</h3>
                
                <div className="bg-gradient-to-r from-[#fff4f6] to-[#f8e8ea] rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-[#8b5b60] mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Transfer Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Bank</div>
                      <div className="font-semibold">U3 Natural Bank</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Account Number</div>
                      <div className="font-semibold">1234567890</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Account Name</div>
                      <div className="font-semibold">U3 Natural Products</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Amount</div>
                      <div className="font-bold text-[#d98893]">{getCartTotal().toFixed(2)} ETB</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Please transfer the exact amount to the account above and upload a screenshot of your payment receipt.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6b7280] mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#6b7280] mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6b7280] mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent transition-all"
                        placeholder="+251 911 234 567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#6b7280] mb-2">Delivery Address *</label>
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rose-500)] focus:border-transparent transition-all"
                      placeholder="Your full address for delivery"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-[#8b5b60]">Upload Payment Screenshot</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Please upload a clear screenshot of your payment receipt showing the transfer details.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-700 text-sm">
                      Make sure your screenshot clearly shows the transaction details including the amount, date, and reference number.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[#6b7280] mb-4">Payment Screenshot *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[var(--rose-500)] transition-colors bg-gray-50">
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
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="text-green-600 font-semibold mb-1">File selected</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{paymentScreenshot.name}</div>
                          <div className="text-sm text-gray-500 mt-2">Click to change file</div>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 bg-[#fff4f6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#d98893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="text-gray-700 font-semibold mb-1">Upload Payment Screenshot</div>
                          <div className="text-sm text-gray-500 mb-1">PNG, JPG, or JPEG files only</div>
                          <div className="text-sm text-gray-500">(Max 5MB)</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h4 className="font-semibold text-[#8b5b60] mb-4">Order Summary</h4>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <div className="text-gray-600">
                          {item.name} × {item.quantity}
                        </div>
                        <div className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)} ETB
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                      <div>Total</div>
                      <div className="text-[#d98893]">{getCartTotal().toFixed(2)} ETB</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentScreenshot}
                    className="flex-1 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
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
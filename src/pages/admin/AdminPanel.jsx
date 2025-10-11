import React, { useState, useEffect } from 'react';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';
import AdminProducts from './Products';
import AdminOrders from './Orders';
import { isAuthenticated, removeToken, isTokenExpiringSoon } from '../../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';

const navBtn =
  "px-5 py-2 rounded-full text-[var(--rose-600)] hover:bg-[#fff4f6] hover:text-[#171717] font-semibold transition shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--rose-500)]";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [page, setPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Check for session expiration
  useEffect(() => {
    if (!loggedIn) return;
    
    const interval = setInterval(() => {
      if (isTokenExpiringSoon()) {
        setShowSessionWarning(true);
      } else {
        setShowSessionWarning(false);
      }
      
      // If token has expired, log out
      if (!isAuthenticated()) {
        handleLogout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
    setShowSessionWarning(false);
  };

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setPage('dashboard');
    setShowSessionWarning(false);
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <motion.div className="min-h-screen bg-[var(--soft-bg)]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <nav className="flex items-center justify-between bg-white py-5 px-4 md:px-8 rounded-b-2xl shadow"
           style={{ boxShadow: 'var(--soft-shadow)' }}>
        <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--rose-600)]">Admin Panel</span>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <button onClick={() => setPage('dashboard')} className={navBtn + (page === 'dashboard' ? " bg-[var(--rose-500)] text-white" : "")}>Dashboard</button>
          <button onClick={() => setPage('products')} className={navBtn + (page === 'products' ? " bg-[var(--rose-500)] text-white" : "")}>Products</button>
          <button onClick={() => setPage('orders')} className={navBtn + (page === 'orders' ? " bg-[var(--rose-500)] text-white" : "")}>Orders</button>
          <button onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-[var(--rose-600)] text-white font-semibold shadow hover:bg-[var(--rose-500)] transition">Logout</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Session expiration warning */}
      <AnimatePresence>
        {showSessionWarning && (
          <motion.div
            className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-700 text-sm">
                Your session is about to expire. Please save your work and consider logging out and back in.
              </p>
              <button 
                onClick={handleLogout}
                className="ml-auto text-yellow-700 hover:text-yellow-900 font-medium text-sm"
              >
                Logout Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
              <button 
                onClick={() => { setPage('dashboard'); setIsMobileMenuOpen(false); }} 
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  page === 'dashboard' 
                    ? 'bg-[var(--rose-500)] text-white' 
                    : 'text-[var(--rose-600)] hover:bg-[#fff4f6]'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setPage('products'); setIsMobileMenuOpen(false); }} 
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  page === 'products' 
                    ? 'bg-[var(--rose-500)] text-white' 
                    : 'text-[var(--rose-600)] hover:bg-[#fff4f6]'
                }`}
              >
                Products
              </button>
              <button 
                onClick={() => { setPage('orders'); setIsMobileMenuOpen(false); }} 
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  page === 'orders' 
                    ? 'bg-[var(--rose-500)] text-white' 
                    : 'text-[var(--rose-600)] hover:bg-[#fff4f6]'
                }`}
              >
                Orders
              </button>
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg font-semibold bg-[var(--rose-600)] text-white hover:bg-[var(--rose-500)] transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="py-10 px-4 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {page === 'dashboard' && (
            <motion.div key="dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}>
              <AdminDashboard />
            </motion.div>
          )}
          {page === 'products' && (
            <motion.div key="products"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}>
              <AdminProducts />
            </motion.div>
          )}
          {page === 'orders' && (
            <motion.div key="orders"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}>
              <AdminOrders />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
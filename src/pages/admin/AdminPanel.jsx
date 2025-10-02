import React, { useState } from 'react';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';
import AdminProducts from './Products';
import AdminOrders from './Orders';
import { isAuthenticated, removeToken } from '../../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';

const navBtn =
  "px-5 py-2 rounded-full text-[var(--rose-600)] hover:bg-[#fff4f6] hover:text-[#171717] font-semibold transition shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--rose-500)]";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [page, setPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
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
          <button onClick={() => { removeToken(); setLoggedIn(false); }}
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
                onClick={() => { removeToken(); setLoggedIn(false); setIsMobileMenuOpen(false); }}
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
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import SearchModal from "./SearchModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/track-order", label: "Track Order" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartItemCount } = useCart();

  return (
    <header className="w-full z-30 bg-transparent sticky top-0">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto mt-4 flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl glass-card"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={logo}
            alt="U3 Natural Product"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow group-hover:shadow-lg transition-all duration-300"
            initial={{ scale: 0.9, rotate: -8 }}
            animate={{ scale: 1, rotate: [0, 10, 0] }}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
            transition={{ duration: 1.2 }}
            style={{ borderRadius: "50%" }}
          />
          <motion.span 
            className="ml-2 text-lg sm:text-2xl font-extrabold text-[var(--rose-600)] tracking-tight group-hover:text-[var(--rose-500)] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            U3 Natural
          </motion.span>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2">
          {links.map((link, index) => (
            <motion.li 
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
              <Link
                to={link.to}
                className={
                    "text-sm lg:text-base font-semibold px-4 py-2 rounded-full transition-all duration-300 " +
                  (pathname === link.to
                      ? "bg-[var(--rose-500)] text-white shadow-lg"
                      : "text-[#171717] hover:bg-[#fff4f6] hover:text-[var(--rose-600)] hover:shadow-md")
                }
              >
                {link.label}
              </Link>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-3 text-[#9ca3af]">
          <motion.button 
            aria-label="Search" 
            className="p-2 rounded-full hover:bg-[#fff8f2]"
            onClick={() => setIsSearchOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </motion.button>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart" aria-label="Cart" className="p-2 rounded-full hover:bg-[#fff8f2] relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {getCartItemCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-[var(--rose-500)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {getCartItemCount()}
                </motion.span>
              )}
            </Link>
          </motion.div>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Cart Icon */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart" aria-label="Cart" className="p-2 rounded-full hover:bg-[#fff8f2] relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {getCartItemCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-[var(--rose-500)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {getCartItemCount()}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-[#fff8f2] transition-colors duration-200"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <motion.path 
                  d="M18 6L6 18M6 6l12 12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.path 
                  d="M3 12h18M3 6h18M3 18h18"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-2 rounded-2xl glass-card overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={
                        "block text-base font-semibold px-4 py-3 rounded-full transition-all duration-300 " +
                        (pathname === link.to
                          ? "bg-[var(--rose-500)] text-white shadow-lg"
                          : "text-[#171717] hover:bg-[#fff4f6] hover:text-[var(--rose-600)] hover:shadow-md")
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <motion.button 
                  aria-label="Search" 
                  className="p-2 rounded-full hover:bg-[#fff8f2]"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
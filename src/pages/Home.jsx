import React, { useEffect, useState } from "react";
import { fetchProducts, getImageUrl } from "../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
import logo from "../assets/logo.png";
import ImageModal from "../components/ImageModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [modalSrc, setModalSrc] = useState(null);
  const [modalAlt, setModalAlt] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center text-center md:text-left md:justify-between mb-20 mt-20 gap-6 md:gap-8">
          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              className="uppercase tracking-widest text-[var(--rose-500)] font-semibold mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Premium Skincare
            </motion.div>
            <motion.h1 
              className="text-[2.2rem] sm:text-[2.8rem] md:text-[4.2rem] font-extrabold text-[#8b5b60] leading-tight mb-3 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Natural Beauty
              </motion.span>
              <br />
              <motion.span 
                className="text-[#8b5b60]/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                For Your Skin
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-[#7f8a96] max-w-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Discover our collection of 100% natural skincare products designed to nourish, protect, and enhance your natural beauty.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="#products"
                className="btn-primary inline-block bg-gradient-to-r from-[#d98893] to-[#c06a75] hover:from-[#c06a75] hover:to-[#d98893] text-white px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 font-semibold transform hover:shadow-xl"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Shop Now →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, delay: 0.2 }}
          >
            <motion.img
              src={logo}
              alt="U3 Logo"
              className="rounded-full w-[220px] sm:w-[240px] md:w-[260px] h-[220px] sm:h-[240px] md:h-[260px] shadow-2xl border-8 border-white will-change-transform float-slow"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                e.currentTarget.style.transform = `rotate(${angle/6}deg)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg)'; }}
            />
          </motion.div>
        </section>

        {/* Our Story - Moved to be above Featured Products */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Our Story</h2>
          <div className="h-1 w-24 mx-auto bg-[#d98893] rounded-full mb-6"></div>
          <p className="text-center text-[#6b7280] max-w-3xl mx-auto mb-10">Founded with a passion for natural beauty and wellness, U3 Natural Product creates premium skincare solutions using only the finest natural ingredients.</p>

          {/* Replaced the image with a text-focused card */}
          <div className="bg-white rounded-3xl shadow-lg max-w-4xl mx-auto p-8" style={{ boxShadow: "var(--soft-shadow)" }}>
            <div className="text-center text-[#6b7280] leading-relaxed space-y-4">
              <p>
                At U3 Natural, we believe that true beauty doesn't come from a lab — it begins with nature itself. 🌿
              </p>
              <p>
                Every product we create is a celebration of purity, crafted with care from the finest handpicked ingredients sourced straight from the earth.
              </p>
              <p>
                No harsh chemicals. No artificial additives. Just clean, honest formulas designed to nourish your skin, body, and soul — the way nature intended. 💚
              </p>
              <p>
                From the first touch, you'll feel the difference — the softness of natural oils, the freshness of organic botanicals, and the peace of knowing what you're putting on your skin is as pure as it gets.
              </p>
              <p>
                Because at U3 Natural, beauty isn't just about how you look — it's about how you feel: refreshed, confident, and connected to the natural world around you. 🌸
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products - Moved to be after Our Story */}
        <motion.section 
          id="products" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-extrabold text-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Featured Products
          </motion.h2>
          <motion.p 
            className="text-center text-[#6b7280] max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our most popular natural skincare products, carefully formulated with premium ingredients to enhance your natural beauty.
          </motion.p>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12
                }
              }
            }}
          >
            {products.map((product) => {
              const imgSrc = getImageUrl(product.image);
              return (
                <motion.div
                  key={product._id}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px 0 rgba(217, 136, 147, 0.3)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-3xl p-6 shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ boxShadow: "var(--soft-shadow)" }}
                  initial={{ opacity: 0, y: 30, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <motion.div 
                      className="bg-white rounded-2xl mb-5 flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300" 
                      style={{ minHeight: 196 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-48 object-contain rounded-2xl shadow cursor-pointer p-4 transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalSrc(imgSrc);
                          setModalAlt(product.name);
                        }}
                        onError={(e) => { e.target.src = ''; }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="flex flex-col gap-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.span 
                        className="font-semibold text-xl group-hover:text-[var(--rose-600)] transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        {product.name}
                      </motion.span>
                      <motion.span 
                        className="text-[var(--rose-600)] font-bold text-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {product.price} ETB
                      </motion.span>
                      <motion.span 
                        className="text-sm text-[#8b8b8b] group-hover:text-[var(--rose-500)] transition-colors duration-300"
                      >
                        {product.category}
                      </motion.span>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="mt-2 bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Feature Cards after products */}
        <motion.section 
          className="mb-20 bg-pink-50 rounded-3xl py-14"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-extrabold text-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Choose U3 Natural
          </motion.h2>
          <motion.p 
            className="text-center text-[#6b7280] max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our commitment to natural beauty goes beyond our products. We believe in sustainable practices and ethical standards.
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-8"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            viewport={{ once: true }}
          >
            {["100% Natural","Dermatologically Tested","Effective Results","Cruelty-Free"].map((title, i) => (
              <motion.div 
                key={i} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                style={{ boxShadow: "var(--soft-shadow)" }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px 0 rgba(217, 136, 147, 0.25)"
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-2xl font-semibold mb-2 group-hover:text-[var(--rose-600)] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {title}
                </motion.div>
                <motion.div 
                  className="text-[#6b7280] group-hover:text-[#8b5b60] transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {i===0?"All our products are made with natural ingredients, free from harmful chemicals.":i===1?"Our products are tested and proven safe for all skin types.":i===2?"See visible improvements in your skin's appearance and health.":"We never test on animals and respect all living beings."}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
      {modalSrc && <ImageModal src={modalSrc} alt={modalAlt} onClose={() => { setModalSrc(null); setModalAlt(''); }} />}
      <Footer />
    </>
  );
}
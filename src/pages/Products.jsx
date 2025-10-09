import React, { useEffect, useState } from 'react';
import { fetchProducts, getImageUrl } from '../utils/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductSkeleton from '../components/ProductSkeleton';
import ImageModal from '../components/ImageModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSrc, setModalSrc] = useState(null);
  const [modalAlt, setModalAlt] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(products => {
        setProducts(products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold mb-4 text-[#8b5b60]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Products
          </motion.h1>
          <motion.p 
            className="text-[#6b7280] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore all of our natural skincare products designed to enhance your natural beauty.
          </motion.p>
        </motion.div>
        
        {loading ? (
          <ProductSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b7280] text-lg">No products available yet.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
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
                    boxShadow: "0 25px 50px 0 rgba(217, 136, 147, 0.3)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-3xl p-6 shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ boxShadow: "var(--soft-shadow)" }}
                  initial={{ opacity: 0, y: 30, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl mb-4 bg-white flex items-center justify-center" style={{ minHeight: 196 }}>
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-48 object-contain transition-transform duration-300 cursor-pointer p-4"
                        loading="lazy"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalSrc(imgSrc);
                          setModalAlt(product.name);
                        }}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalSrc(imgSrc);
                          setModalAlt(product.name);
                        }}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-[#8b5b60] px-3 py-1 rounded-full text-sm shadow opacity-0 hover:opacity-100 transition-opacity"
                      >
                        View
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-[#1f2937] line-clamp-2">{product.name}</h3>
                      <p className="text-[var(--rose-600)] font-bold text-xl">{product.price} ETB</p>
                      <p className="text-sm text-[#6b7280] capitalize">{product.category}</p>
                      {product.description && (
                        <p className="text-sm text-[#6b7280] line-clamp-2">{product.description}</p>
                      )}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
      {modalSrc && <ImageModal src={modalSrc} alt={modalAlt} onClose={() => { setModalSrc(null); setModalAlt(''); }} />}
      <Footer />
    </>
  );
}
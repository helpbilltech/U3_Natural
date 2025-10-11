import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, getImageUrl } from '../utils/api';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageModal from '../components/ImageModal';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => { fetchProduct(id).then(setProduct); }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1, document.getElementById('add-to-cart-btn'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (!product) return <div className="p-8">Loading...</div>;

  const imgSrc = getImageUrl(product.image);

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-6xl mx-auto py-10 px-4 bg-white rounded-3xl shadow-lg mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-white p-8 border border-[#f0f0f0]">
              <motion.img
                src={imgSrc}
                alt={product.name}
                className="w-full h-96 object-contain rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => { setModalSrc(imgSrc); setModalOpen(true); }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className="absolute top-6 right-6 bg-[#d98893] text-white text-sm font-bold px-4 py-2 rounded-full">
                {product.category}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4 text-[#8b5b60]">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-[var(--rose-600)]">{product.price} ETB</div>
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock
              </div>
            </div>

            <p className="text-lg text-[#444] mb-8 leading-relaxed">{product.description}</p>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#8b5b60]">Benefits</h2>
              <ul className="space-y-3">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-3">
                      <div className="w-6 h-6 rounded-full bg-[#d98893]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d98893]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-[#555]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-[#8b5b60]">How to Use</h2>
              <p className="text-[#555] leading-relaxed">{product.usage}</p>
            </div>

            <motion.div 
              className="mt-auto"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className={`w-full px-8 py-4 rounded-full text-center text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                  addedToCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: addedToCart ? 1.05 : 1 }}
              >
                {addedToCart ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {modalOpen && <ImageModal src={modalSrc} alt={product.name} onClose={() => setModalOpen(false)} />}
      <Footer />
    </>
  );
}
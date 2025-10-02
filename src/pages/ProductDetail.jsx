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
      addToCart(product);
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
        className="max-w-2xl mx-auto py-10 px-6 bg-white rounded-3xl shadow-lg mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ boxShadow: 'var(--soft-shadow)' }}
      >
        <motion.img
          src={imgSrc}
          alt={product.name}
          className="w-full max-h-[520px] object-contain rounded-2xl mb-6 cursor-pointer bg-white p-6"
          whileHover={{ scale: 1.03, rotate: 1.5 }}
          transition={{ duration: 0.3 }}
          onClick={() => { setModalSrc(imgSrc); setModalOpen(true); }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
        <div className="text-[var(--rose-600)] font-bold text-xl mb-2">{product.price} ETB</div>
        <div className="mb-3 text-[#8b8b8b]">{product.category}</div>
        <p className="mb-5 text-[#444]">{product.description}</p>
        <div className="mb-4">
          <h2 className="font-semibold mb-2 text-[var(--rose-500)]">Benefits:</h2>
          <ul className="list-disc ml-6 text-[#555]">
            {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-[var(--rose-500)]">Usage:</h2>
          <p className="text-[#555]">{product.usage}</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }}>
          <motion.button
            onClick={handleAddToCart}
            className={`w-full px-7 py-2 rounded-full text-center text-lg font-semibold transition-all duration-300 ${
              addedToCart 
                ? 'bg-green-500 text-white' 
                : 'bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white'
            }`}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: addedToCart ? 1.05 : 1 }}
          >
            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </motion.button>
        </motion.div>
      </motion.div>
      {modalOpen && <ImageModal src={modalSrc} alt={product.name} onClose={() => setModalOpen(false)} />}
      <Footer />
    </>
  );
}
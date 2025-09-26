import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Benefits from '../components/sections/Benefits';
import AboutSection from '../components/sections/AboutSection';
import TestimonialsSlider from '../components/sections/TestimonialsSlider';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Fetch products from backend API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart logic will be refactored to use backend endpoints later

  const handleAddToCart = product => {
    // Will use backend API for cart management
  };

  return (
    <Layout cartItemsCount={cart.length}>
      <Hero />
      <FeaturedProducts products={products} onAddToCart={handleAddToCart} />
      <Benefits />
      <AboutSection />
      <TestimonialsSlider />
      <ContactSection />
    </Layout>
  );
};

export default Home;
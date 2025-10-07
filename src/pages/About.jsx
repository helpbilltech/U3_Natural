import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold mb-6 text-[#8b5b60]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About U3 Natural
          </motion.h1>
          <motion.div 
            className="h-1 w-24 mx-auto bg-[#d98893] rounded-full mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
          <motion.p 
            className="text-xl text-[#6b7280] max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Discover the story behind U3 Natural, where nature meets beauty in perfect harmony.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#8b5b60]">Our Story</h2>
            <div className="space-y-4 text-[#6b7280] leading-relaxed">
              <p>
                At U3 Natural, we believe true beauty begins with nature. 🌿 Founded with a passion for natural beauty and wellness, 
                U3 Natural creates premium skincare solutions using only the finest natural ingredients sourced from around the world.
              </p>
              <p>
                Our journey started with a simple yet powerful belief: that nature provides everything we need for healthy, radiant skin. 
                Every jar is prepared with love, using only pure, handpicked ingredients — no harsh chemicals, just nature's care. 💚
              </p>
              <p>
                We understand that your skin deserves the best, which is why we've dedicated ourselves to creating products that not only 
                enhance your natural beauty but also respect the environment and your skin's health.
              </p>
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#8b5b60]">Our Mission</h2>
            <div className="space-y-4 text-[#6b7280] leading-relaxed">
              <p>
                To provide you with the purest, most effective natural skincare products that enhance your natural beauty while 
                respecting the environment and your skin's health. We are committed to creating products that are:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-[#d98893] mr-2">•</span>
                  <span>100% natural and organic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d98893] mr-2">•</span>
                  <span>Dermatologically tested and safe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d98893] mr-2">•</span>
                  <span>Cruelty-free and ethically sourced</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d98893] mr-2">•</span>
                  <span>Environmentally conscious</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Our Promise */}
        <motion.div 
          className="bg-gradient-to-r from-[#fff8f2] to-[#fef7f0] rounded-3xl p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#8b5b60]">Our Promise</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-[#6b7280] leading-relaxed mb-6">
              Every product is carefully crafted with organic ingredients, free from harmful chemicals, and tested for effectiveness. 
              Your skin deserves the best nature has to offer, and we're here to deliver exactly that.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d98893] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-semibold text-[#8b5b60] mb-2">100% Natural</h3>
                <p className="text-sm text-[#6b7280]">Pure, organic ingredients sourced from nature</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d98893] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="font-semibold text-[#8b5b60] mb-2">Scientifically Tested</h3>
                <p className="text-sm text-[#6b7280]">Dermatologically tested for safety and efficacy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d98893] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💚</span>
                </div>
                <h3 className="font-semibold text-[#8b5b60] mb-2">Cruelty-Free</h3>
                <p className="text-sm text-[#6b7280]">Never tested on animals, always ethical</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-[#8b5b60]">Why Choose U3 Natural?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#8b5b60] mb-4">Premium Quality</h3>
              <p className="text-[#6b7280] leading-relaxed">
                We source only the finest natural ingredients from trusted suppliers around the world. 
                Each ingredient is carefully selected for its proven benefits and purity.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#8b5b60] mb-4">Proven Results</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Our products are formulated based on scientific research and traditional knowledge, 
                ensuring you see real, visible improvements in your skin's health and appearance.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#8b7280] mb-4">Sustainable Practices</h3>
              <p className="text-[#6b7280] leading-relaxed">
                We're committed to environmental responsibility, using eco-friendly packaging and 
                sustainable sourcing practices that protect our planet for future generations.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#8b5b60] mb-4">Customer Care</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Your satisfaction is our priority. We provide personalized skincare advice and 
                support to help you achieve your natural beauty goals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#8b5b60]">Ready to Experience Natural Beauty?</h2>
          <p className="text-lg text-[#6b7280] mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the power of natural skincare with U3 Natural.
          </p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/products"
              className="bg-[#d98893] hover:bg-[#c06a75] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Our Products
            </motion.a>
            <motion.a
              href="/contact"
              className="border-2 border-[#d98893] text-[#d98893] hover:bg-[#d98893] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}



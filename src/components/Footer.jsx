import React from "react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="w-full bg-[#8b5b60] text-white/95">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="U3 Natural" className="w-10 h-10 rounded-full" />
              <div className="text-xl font-semibold">U3 <span className="font-normal">Natural</span></div>
            </div>
            <p className="text-white/80 leading-7 mb-6">
              Premium natural skincare products made with 100% natural ingredients. Designed to enhance your natural beauty.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/u3naturalproduct?igsh=Y3lkYXVrdjdudGxx" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-semibold">Instagram</span>
              </a>
              <a 
                href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40naturalproduct06%3F_t%3DZM-8zbVrL2FKrN%26_r%3D1&e=AT3FT9-OBUya9khBTTqWIHwvNqy1aojULAxkc7CHMxDMBeEBs6Tl--5094WX5_d5lRqTMZku1m-cfltgVX87PFBRZgG8X66t" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="font-semibold">TikTok</span>
              </a>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold mb-4">Quick Links</div>
            <ul className="space-y-3 text-white/85">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/track-order" className="hover:text-white">Track Order</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <img src={logo} alt="U3 Natural" className="w-6 h-6 rounded-full" />
            <span>© {new Date().getFullYear()} U3 Natural Products. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}



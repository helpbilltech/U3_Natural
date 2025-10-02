import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">About</h1>
        <p className="text-[#6b7280] max-w-3xl">Founded with a passion for natural beauty and wellness, U3 Natural Product creates premium skincare solutions using only the finest natural ingredients.</p>
      </main>
      <Footer />
    </>
  );
}



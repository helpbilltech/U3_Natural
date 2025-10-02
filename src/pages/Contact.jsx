import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Contact</h1>
        <p className="text-[#6b7280] mb-6">Have questions? Get in touch and we’ll get back to you.</p>
        <form className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <input className="px-4 py-3 rounded-xl border" placeholder="Your name" />
          <input className="px-4 py-3 rounded-xl border" placeholder="Your email" />
          <textarea className="px-4 py-3 rounded-xl border md:col-span-2" rows="5" placeholder="Message" />
          <button className="btn-primary bg-[#ffb871] hover:bg-[#ff9c40] text-white px-6 py-3 rounded-full w-max">Send</button>
        </form>
      </main>
      <Footer />
    </>
  );
}



import React, { useState } from 'react';
import { loginAdmin } from '../../utils/api';
import { setToken } from '../../utils/auth';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token, message } = await loginAdmin(username, password);
      if (token) {
        setToken(token);
        onLogin();
      } else {
        setError(message || 'Login failed');
      }
    } catch (err) {
      setError('Login error');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f2] py-12">
      <motion.div
        className="mb-8 rounded-full border-8 border-[#fff8f2] shadow-xl bg-white flex items-center justify-center"
        style={{ width: 130, height: 130 }}
        initial={{ scale: 0.7, rotate: -20 }}
        animate={{ scale: [0.7, 1.08, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.img
          src={logo}
          alt="U3 Admin Logo"
          className="rounded-full w-28 h-28 object-cover"
          initial={{ opacity: 0.7, scale: 0.93 }}
          animate={{ opacity: 1, scale: [0.93, 1.06, 1] }}
          transition={{ duration: 1.2, delay: 0.15 }}
        />
      </motion.div>
      <form onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
            style={{ boxShadow: 'var(--soft-shadow)' }}>
        <h2 className="text-2xl font-bold text-[#171717] mb-2 text-center">Admin Login</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"
               className="w-full p-3 border border-[#ffb871] focus:outline-none focus:ring-2 focus:ring-[#ff9c40] rounded-xl transition bg-[#fff8f2]" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
               className="w-full p-3 border border-[#ffb871] focus:outline-none focus:ring-2 focus:ring-[#ff9c40] rounded-xl transition bg-[#fff8f2]" />
        <button type="submit"
                className="w-full bg-[#ffb871] hover:bg-[#ff9c40] text-white py-3 rounded-xl font-semibold transition text-lg shadow">Login</button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </main>
  );
}
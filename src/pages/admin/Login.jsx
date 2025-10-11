import React, { useState } from 'react';
import { loginAdmin } from '../../utils/api';
import { setToken, isAuthenticated } from '../../utils/auth';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Check if already authenticated
    if (isAuthenticated()) {
      onLogin();
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginAdmin(username, password);
      
      if (result.error) {
        setError(result.message || 'Login failed');
      } else if (result.token) {
        setToken(result.token);
        onLogin();
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Enter your username"
            className="w-full p-3 border border-[#ffb871] focus:outline-none focus:ring-2 focus:ring-[#ff9c40] rounded-xl transition bg-[#fff8f2]"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Enter your password"
            className="w-full p-3 border border-[#ffb871] focus:outline-none focus:ring-2 focus:ring-[#ff9c40] rounded-xl transition bg-[#fff8f2]"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#ffb871] hover:bg-[#ff9c40] disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition text-lg shadow"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : 'Login'}
        </button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>For security reasons, sessions expire after 24 hours.</p>
        </div>
      </form>
    </main>
  );
}
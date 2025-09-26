import React, { useState } from 'react';
import { api } from '../../utils/api';
import { setToken } from '../../utils/auth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await api('/admin/login', 'POST', { username, password });
      setToken(token);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input className="mb-3 w-full p-2 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="mb-3 w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
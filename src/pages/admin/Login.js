import React, { useState } from 'react';
import { loginAdmin } from '../../utils/api';
import { setToken } from '../../utils/auth';

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
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}
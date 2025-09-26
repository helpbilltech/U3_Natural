import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './pages/admin/AdminPanel';
// ... import other user-facing components

function App() {
  return (
    <Router>
      <Routes>
        {/* User-facing routes */}
        {/* <Route path=\"/\" element={<Home />} /> */}
        {/* <Route path=\"/product/:id\" element={<ProductDetail />} /> */}
        {/* ... other routes ... */}

        {/* Admin route */}
        <Route path=\"/admin/*\" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
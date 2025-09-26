// API utility for connecting to backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
}

export async function createProduct(product, token) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function updateProduct(id, product, token) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getSalesAnalytics(token) {
  const res = await fetch(`${API_URL}/dashboard/sales`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}
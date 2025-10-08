const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace(/\/?api\/?$/, '');

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  
  // If path already starts with /api/products/uploads, use it as is
  if (imagePath.startsWith('/api/products/uploads')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // If path starts with /uploads, convert to /api/products/uploads
  if (imagePath.startsWith('/uploads')) {
    return `${BASE_URL}/api/products${imagePath}`;
  }
  
  // For any other path, prepend the base URL
  return `${BASE_URL}${imagePath}`;
}

export async function fetchProducts() {
  try {
    console.log('Fetching products from:', `${API_URL}/products`);
    const res = await fetch(`${API_URL}/products`);
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Fetched products data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createProduct(product, token, isFormData = false) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: isFormData ? { Authorization: `Bearer ${token}` } : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: isFormData ? product : JSON.stringify(product)
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: true, message: error.message || 'Failed to create product' };
    }
    
    return res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: true, message: 'Failed to create product' };
  }
}

export async function updateProduct(id, product, token, isFormData = false) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: isFormData ? { Authorization: `Bearer ${token}` } : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: isFormData ? product : JSON.stringify(product)
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: true, message: error.message || 'Failed to update product' };
    }
    
    return res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: true, message: 'Failed to update product' };
  }
}

export async function deleteProduct(id, token) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: true, message: error.message || 'Failed to delete product' };
    }
    
    return res.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: true, message: 'Failed to delete product' };
  }
}

export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: true, message: error.message || 'Login failed' };
    }
    
    return res.json();
  } catch (error) {
    console.error('Error logging in:', error);
    return { error: true, message: 'Login failed' };
  }
}

export async function getSalesAnalytics(token) {
  try {
    const res = await fetch(`${API_URL}/dashboard/sales`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch sales analytics');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    throw error;
  }
}

export async function getAnalytics(token) {
  try {
    const res = await fetch(`${API_URL}/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch analytics');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

// Note: placeOrder function removed - now using CheckoutModal component
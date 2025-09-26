import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import { getToken } from '../../utils/auth';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', category: '' });

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (editProduct) {
      const updated = await updateProduct(editProduct._id, form, getToken());
      setProducts(products.map(p => p._id === updated._id ? updated : p));
      setEditProduct(null);
    } else {
      const created = await createProduct(form, getToken());
      setProducts([...products, created]);
    }
    setForm({ name: '', price: '', image: '', description: '', category: '' });
  };

  const handleEdit = product => {
    setEditProduct(product);
    setForm(product);
  };

  const handleDelete = async id => {
    await deleteProduct(id, getToken());
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" />
        <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL" />
        <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" />
        <button type="submit">{editProduct ? 'Update' : 'Create'}</button>
        {editProduct && <button onClick={() => setEditProduct(null)}>Cancel</button>}
      </form>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} (${product.price})
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
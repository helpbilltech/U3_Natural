import React, { useState } from 'react';
import { api } from '../../utils/api';
import { getToken } from '../../utils/auth';

export default function ProductForm({ product, onAdded, onUpdated, onCancel }: any) {
  const [form, setForm] = useState(product || { name: '', price: '', category: '', description: '', image: '', benefits: '', usage: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, benefits: form.benefits.split('\n') };
      if (product && product._id) {
        const updated = await api(`/products/${product._id}`, 'PUT', payload, getToken()!);
        onUpdated(updated);
      } else {
        const added = await api('/products', 'POST', payload, getToken()!);
        onAdded(added);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{product && product._id ? "Edit Product" : "Add Product"}</h2>
        <input name="name" value={form.name} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Name" required />
        <input name="price" value={form.price} onChange={handleChange} className="mb-3 w-full p-2 border rounded" type="number" placeholder="Price" required />
        <input name="category" value={form.category} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Category" required />
        <input name="image" value={form.image} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Image URL" />
        <textarea name="description" value={form.description} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Description" />
        <textarea name="benefits" value={Array.isArray(form.benefits) ? form.benefits.join('\n') : form.benefits} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Benefits (one per line)" />
        <textarea name="usage" value={form.usage} onChange={handleChange} className="mb-3 w-full p-2 border rounded" placeholder="Usage" />
        <div className="flex gap-4 mt-4">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
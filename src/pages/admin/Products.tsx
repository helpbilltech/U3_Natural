import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { getToken } from '../../utils/auth';
import ProductForm from './ProductForm';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    api('/products')
      .then(setProducts)
      .catch(e => alert(e.message));
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete product?')) return;
    await api(`/products/${id}`, 'DELETE', undefined, getToken()!);
    setProducts(products.filter(p => p._id !== id));
  }

  function handleEdit(product: any) {
    setEditing(product);
  }

  function handleAdded(newProduct: any) {
    setProducts([...products, newProduct]);
    setEditing(null);
  }

  function handleUpdated(updatedProduct: any) {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    setEditing(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <button onClick={() => setEditing({})} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod._id}>
              <td className="p-2">{prod.name}</td>
              <td className="p-2">${prod.price}</td>
              <td className="p-2">{prod.category}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(prod)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(prod._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing !== null && (
        <ProductForm
          product={editing}
          onAdded={handleAdded}
          onUpdated={handleUpdated}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
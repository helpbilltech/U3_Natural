import React, { useEffect, useState, useRef } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, getImageUrl } from '../../utils/api';
import { getToken } from '../../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from '../../components/ImageModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', benefits: '', usage: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalSrc, setModalSrc] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => { 
    fetchProducts().then(products => {
      console.log('Fetched products:', products);
      setProducts(products);
    }).catch(err => {
      console.error('Error fetching products:', err);
    });
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.price || !form.description || !form.category) {
      alert('Please fill in all required fields (Name, Price, Description, Category)');
      return;
    }
    
    // Validate price is a valid number
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      alert('Please enter a valid price (positive number)');
      return;
    }
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);

    try {
      console.log('Submitting product:', { editing: !!editing, form, hasImage: !!imageFile });
      
      if (editing) {
        const updated = await updateProduct(editing._id, formData, getToken(), true);
        console.log('Update result:', updated);
        if (updated.error) {
          alert('Error updating product: ' + updated.message);
          return;
        }
        setProducts(products.map(p => p._id === updated._id ? updated : p));
        setEditing(null);
      } else {
        const created = await createProduct(formData, getToken(), true);
        console.log('Create result:', created);
        if (created.error) {
          alert('Error creating product: ' + created.message);
          return;
        }
        setProducts([...products, created]);
      }
      
      // Reset form
      setForm({ name: '', price: '', description: '', category: '', benefits: '', usage: '' });
      setImageFile(null);
      setImagePreview(null);
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(`Error submitting product: ${error.message || 'Please try again.'}`);
    }
  };

  const handleEdit = product => {
    setEditing(product);
    setForm({
      ...product,
      benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : '',
      usage: product.usage || ''
    });
    setImageFile(null);
    setImagePreview(product.image ? getImageUrl(product.image) : null);
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const result = await deleteProduct(id, getToken());
      if (result.error) {
        alert('Error deleting product: ' + result.message);
        return;
      }
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const createTestProduct = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Test product created:', result);
      if (result.product) {
        setProducts([result.product, ...products]);
      }
    } catch (error) {
      console.error('Error creating test product:', error);
    }
  };

  return (
    <motion.section
      className="bg-white rounded-3xl shadow-lg p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ boxShadow: 'var(--soft-shadow)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[var(--rose-600)]">Product Management</h2>
        <button 
          onClick={createTestProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
        >
          Create Test Product
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8 bg-[#fff8f2] rounded-2xl p-6 shadow"
            style={{ boxShadow: 'var(--soft-shadow)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
          <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
        </div>
        {imagePreview && <img src={imagePreview} alt="" className="w-32 h-32 object-cover rounded-2xl mx-auto border mt-2" />}
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
        <textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} placeholder="Benefits (one per line)" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
        <textarea value={form.usage} onChange={e => setForm({ ...form, usage: e.target.value })} placeholder="Usage" className="p-3 border border-[var(--rose-300)] rounded-xl bg-white" />
        <div className="flex gap-6 mt-2">
          <button type="submit" className="btn-primary bg-[var(--rose-600)] hover:bg-[var(--rose-500)] text-white px-7 py-2 rounded-full font-semibold text-lg transition">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => setEditing(null)} className="bg-gray-200 px-7 py-2 rounded-full font-semibold text-lg transition">Cancel</button>}
        </div>
      </form>
      <ul>
        <AnimatePresence>
          {products.map(product => (
            <motion.li
              key={product._id}
              className="mb-4 bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name} 
                  className="w-16 h-16 object-contain rounded-xl shadow cursor-pointer bg-white p-1"
                  onClick={() => setModalSrc(getImageUrl(product.image))}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTlhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div>
                  <div className="font-semibold text-lg">{product.name || 'No Name'}</div>
                  <div className="text-[var(--rose-600)] font-bold">{product.price || '0'} ETB</div>
                  <div className="text-xs text-[#8b8b8b]">{product.category || 'No Category'}</div>
                  {product.description && <div className="text-sm text-gray-600 mt-1">{product.description.substring(0, 50)}...</div>}
                </div>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <button onClick={() => handleEdit(product)} className="px-4 py-2 rounded-full font-semibold bg-[var(--rose-500)] hover:bg-[var(--rose-600)] text-white transition">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="px-4 py-2 rounded-full font-semibold bg-[#1f2937] hover:bg-black text-white transition">Delete</button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {modalSrc && <ImageModal src={modalSrc} alt="Preview" onClose={() => setModalSrc(null)} />}
    </motion.section>
  );
}
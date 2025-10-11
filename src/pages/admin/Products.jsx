import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, getImageUrl } from '../../utils/api';
import { getToken } from '../../utils/auth';
import { motion } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    benefits: '',
    usage: '',
    image: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      let result;
      
      if (editingProduct) {
        // Update existing product
        const productData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          category: formData.category,
          benefits: formData.benefits,
          usage: formData.usage
        };
        
        if (formData.image instanceof File) {
          // If new image is uploaded, use FormData
          const formDataObj = new FormData();
          Object.keys(productData).forEach(key => {
            formDataObj.append(key, productData[key]);
          });
          formDataObj.append('image', formData.image);
          result = await updateProduct(editingProduct._id, formDataObj, token, true);
        } else {
          // If no new image, use JSON
          result = await updateProduct(editingProduct._id, productData, token);
        }
      } else {
        // Create new product
        if (formData.image) {
          // Use FormData for file upload
          const formDataObj = new FormData();
          formDataObj.append('name', formData.name);
          formDataObj.append('price', formData.price);
          formDataObj.append('description', formData.description);
          formDataObj.append('category', formData.category);
          formDataObj.append('benefits', formData.benefits);
          formDataObj.append('usage', formData.usage);
          formDataObj.append('image', formData.image);
          result = await createProduct(formDataObj, token, true);
        } else {
          // Create without image
          const productData = {
            name: formData.name,
            price: formData.price,
            description: formData.description,
            category: formData.category,
            benefits: formData.benefits,
            usage: formData.usage
          };
          result = await createProduct(productData, token);
        }
      }
      
      if (result.error) {
        setError(result.message);
      } else {
        await loadProducts();
        resetForm();
      }
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const token = getToken();
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      const result = await deleteProduct(id, token);
      if (result.error) {
        setError(result.message);
      } else {
        await loadProducts();
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      benefits: product.benefits ? product.benefits.join('\n') : '',
      usage: product.usage,
      image: null
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      benefits: '',
      usage: '',
      image: null
    });
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d98893]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#8b5b60]">Manage Products</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#d98893] hover:bg-[#c06a75] text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4 text-[#8b5b60]">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows="3"
                placeholder="Enter each benefit on a new line"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Instructions *</label>
              <textarea
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d98893] focus:border-transparent"
              />
              {editingProduct && editingProduct.image && !formData.image && (
                <div className="mt-2 text-sm text-gray-500">
                  Current image: {editingProduct.image}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#d98893] hover:bg-[#c06a75] text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price} ETB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-[#d98893] hover:text-[#c06a75] mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}